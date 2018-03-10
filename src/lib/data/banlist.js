const BANLISTS = [
    { name: "None", check: () => true },
    { name: "TCG", check: card => card[12] > 0 },
    { name: "OCG", check: card => card[13] > 0 }
];

Object.freeze(BANLISTS);

export { BANLISTS };
