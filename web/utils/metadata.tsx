export const meta = {
  description:
    "Time to build.",
  external_url: "https://twitter.com/carllippert",
  image:
    "https://ctinsvafusekcbpznpfr.supabase.co/storage/v1/object/public/images/solarpunk.jpeg",
  name: "ambition",
  background_color: "",
  attributes: [
    { trait_type: "Skin Tone", value: "Midnight" },
    { trait_type: "Body Shape", value: "Chiseled" },
    { display_type: "number", trait_type: "Will", value: 5, max_value: 9 },
  ],
    opportunity: { //optimistic naming system for work?
        id: "1",
        job_name: "build a rocket ship",
        description: "to mars and more",
        contact: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0", //flash gordon address
        pay: {
            value: "1000000000000000000",
            module: "0x0000000000000000000000000000000000000000",
        },
        recruiter: {
            value: "0.01",
            module: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0", //maybe a way to change how incentive model works
        },
        requirements: [{
            type: "or",
            address: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
            attesttaions: "",
        },
        {
            type: "and",
            address: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
            attesttaions: "",
        },
        {
            type: "and",
            address: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0",
            attesttaions: "",
        },
        ],
        privelages: [
            {
                type: "decrypt",
                value: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0", //lit protocol or something
                //build an envelope of temporal powers
            },
            {
                type: "communication",
                value: "0x2BfC102290Bc92767B290B60fdfeCa120058ECD0", //syndicated messaging service. 
                //envelope including contact info
            }
        ],
    }
};
