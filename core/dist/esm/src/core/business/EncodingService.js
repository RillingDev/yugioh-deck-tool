var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "inversify";
import { fromByteArray, toByteArray } from "base64-js";
let EncodingService = class EncodingService {
    constructor() {
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();
    }
    encodeString(str) {
        return this.textEncoder.encode(str);
    }
    decodeString(arr) {
        return this.textDecoder.decode(arr);
    }
    encodeUriSafeBase64String(arr) {
        return fromByteArray(arr)
            .replace(/=/g, "~")
            .replace(/\+/g, "_")
            .replace(/\//g, "-");
    }
    decodeUriSafeBase64String(str) {
        return toByteArray(str
            .replace(/~/g, "=")
            .replace(/_/g, "+")
            .replace(/-/g, "/"));
    }
};
EncodingService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EncodingService);
export { EncodingService };
