module FLOO {
    //inspiration
    //https://github.com/coming-chat/aptos-cid/blob/main/sources/cid.move

    use std::error;
    use std::option::{Self, Option};
    use std::signer;
    use std::string::String;

    use aptos_framework::account;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};
    use aptos_token::property_map;
    use aptos_token::token::{Self, TokenId};

    /// The caller is not authorized to perform this operation
    const ENOT_AUTHORIZED: u64 = 0;

    const FEE: u64 = 0; 

    /// Call by @admin who is owner only
    public entry fun initialize(owner: &signer) {
        use aptos_framework::aptos_account;

        assert!(signer::address_of(owner) == @admin, error::permission_denied(ENOT_AUTHORIZED));

        if (!account::exists_at(@admin)) {
            aptos_account::create_account(@admin);
        };

        // token_helper::initialize(owner);
        // https://github.com/coming-chat/aptos-cid/blob/main/sources/token_helper.move

    }
    
    public entry fun createTask( 
        user: &signer,
         //address spending funds to create task
        employer: address,
         //app that mints on behalf     of user
        creator: address, 
        //bounty paid to app that creates on behalf of user
        creatorBounty: u64,
        //bounty paid on completion of task to task completer
        contractorBounty: u64, 
        //bounty paid to address that finds user to complete task
        recruiterBounty: u64,  
        //self explanatory 
        deadline: u64,
        //public metadata image?
        tokenURI: String, 
        //allow arbitrary properties
        property_keys: vector<String>,
        property_values: vector<vector<u8>>,
        property_types: vector<String>,
        whitelist: std::vector<address> 
        ) {

            //transfer coins into this account for escrow
            let price = creatorBounty + contractorBounty + recruiterBounty + FEE; 
            coin::transfer<AptosCoin>(user, this, price); 

    }


}