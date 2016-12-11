"use strict";

const uriLocationNoParam = function() {
    return location.origin + location.pathname;
};

export default uriLocationNoParam;
