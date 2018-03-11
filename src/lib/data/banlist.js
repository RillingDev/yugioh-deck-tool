const BANLISTS = [
    { name: "None", check: () => true, getVal: () => 3 },
    { name: "TCG", check: card => card[12] > 0, getVal: card => card[12] },
    { name: "OCG", check: card => card[13] > 0, getVal: card => card[13] }
];

Object.freeze(BANLISTS);

export { BANLISTS };
