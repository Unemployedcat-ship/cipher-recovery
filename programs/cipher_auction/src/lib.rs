use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("DjrWeC9e7BARJJoSR59u3nMcWDfUyYkXBt1kvs94RojM");

#[program]
pub mod cipher_auction {
    use super::*;

    pub fn create_auction(
        ctx: Context<CreateAuction>,
        supply: u64,
        duration_seconds: i64,
        target_lamports: u64,
        manifest_hash: [u8; 32],
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        auction.creator = ctx.accounts.creator.key();
        auction.token_mint = ctx.accounts.token_mint.key();
        auction.supply = supply;
        auction.target_lamports = target_lamports;
        auction.manifest_hash = manifest_hash;
        auction.end_time = Clock::get()?.unix_timestamp + duration_seconds;
        auction.raised_lamports = 0;
        auction.is_settled = false;
        auction.bump = ctx.bumps.auction;
        Ok(())
    }

    pub fn submit_bid(ctx: Context<SubmitBid>, amount: u64) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let receipt = &mut ctx.accounts.receipt;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.bidder.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        transfer(cpi_context, amount)?;

        auction.raised_lamports += amount;
        receipt.bidder = ctx.accounts.bidder.key();
        receipt.auction = auction.key();
        receipt.amount = amount;
        receipt.bump = ctx.bumps.receipt;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(supply: u64, duration_seconds: i64, target_lamports: u64, manifest_hash: [u8; 32])]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    /// CHECK: Token mint
    pub token_mint: UncheckedAccount<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + Auction::INIT_SPACE,
        seeds = [b"auction", token_mint.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    /// CHECK: Treasury
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitBid<'info> {
    #[account(mut)]
    pub auction: Account<'info, Auction>,
    #[account(
        init_if_needed,
        payer = bidder,
        space = 8 + Receipt::INIT_SPACE,
        seeds = [b"receipt", auction.key().as_ref(), bidder.key().as_ref()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,
    /// CHECK: Vault
    #[account(
        mut,
        seeds = [b"vault", auction.key().as_ref()],
        bump
    )]
    pub vault: UncheckedAccount<'info>,
    /// CHECK: Treasury
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    #[account(mut)]
    pub bidder: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Auction {
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub supply: u64,
    pub target_lamports: u64,
    pub manifest_hash: [u8; 32],
    pub end_time: i64,
    pub raised_lamports: u64,
    pub is_settled: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Receipt {
    pub bidder: Pubkey,
    pub auction: Pubkey,
    pub amount: u64,
    pub bump: u8,
}
