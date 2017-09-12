const eachObject = (obj, fn) => {
    Object.entries(obj).forEach((entry, index) => {
        fn(entry[1], entry[0], index);
    });
};

export default eachObject;
