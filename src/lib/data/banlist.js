const BANLISTS = [{
        name: "None",
        check: () => true,
        getVal: () => 3
    },
    {
        name: "TCG",
        check: card => card.limit[0] > 0,
        getVal: card => card.limit[0]
    },
    {
        name: "OCG",
        check: card => card.limit[1] > 0,
        getVal: card => card.limit[1]
    }
];

Object.freeze(BANLISTS);

export {
    BANLISTS
};
