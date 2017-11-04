const filterOutOnce = function (idList, idTarget) {
    let idWasFound = false;

    return idList.filter(id => {
        if (!idWasFound && id === idTarget) {
            idWasFound = true;

            return false;
        } else {
            return true;
        }
    });
};
export default filterOutOnce;
