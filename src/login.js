import * as Config from "./config"
import axios from "axios"
import * as JsSHA256 from 'js-sha256'

import { Notyf } from 'notyf';
import "notyf/notyf.min.css"
export const notyf = new Notyf({
    position: {
        x: "center",
        y: "center"
    }
});
import * as CookieTool from "./cookietool"

function sha256(str) {
    return JsSHA256.sha256(str)
}

export async function Login(username, password) {
    var ret = await axios.get(Config.SERVER_URL + Config.API_MAP.Login + username + "/" + await sha256(password))
    var retdata = ret.data
    if (retdata.success) {
        notyf.success(retdata.message)
        CookieTool.setCookie("token", retdata.data.token, 30)
        CookieTool.setCookie("username", retdata.data.username, 30)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }
    else {
        notyf.error(retdata.message)
    }
}

export async function Register(username, email, email_verify, password) {
    var ret = await axios.get(Config.SERVER_URL + Config.API_MAP.Register + email + "/" + username + "/" + await sha256(password) + "/" + email_verify)
    var retdata = ret.data
    console.log(retdata)
    if (retdata.success) {
        notyf.success(retdata.message)
    }
    else {
        notyf.error(retdata.message)
    }
}

export async function RegisterSendCode(username, email, captcha) {
    var ret = await axios.get(Config.SERVER_URL + Config.API_MAP.RegisterSendCode + email + "/" + username + "/" + captcha)
    var retdata = ret.data
    console.log(retdata)
    if (retdata.success) {
        notyf.success(retdata.message)
        return true
    }
    else {
        notyf.error(retdata.message)
        return false
    }
}