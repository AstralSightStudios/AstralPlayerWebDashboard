import * as CookieTool from "./cookietool"
import axios from "axios"

import * as Config from "./config"

import { Notyf } from 'notyf';
import "notyf/notyf.min.css"
export const notyf = new Notyf({
    position: {
        x: "center",
        y: "center"
    },
    duration: 3000
});

export let USERDATA = {}

export function Logout(){
    CookieTool.setCookie("token","")
    window.location.reload()
}

export async function InitDashBoardPage(){
    USERDATA = (await axios.get(Config.SERVER_URL + Config.API_MAP.TokenLogin + CookieTool.getCookie("token") + "/" + CookieTool.getCookie("username"))).data
    if(USERDATA.success){
        USERDATA = USERDATA.data
        if(USERDATA.is_vip){
            USERDATA.is_vip = "已开通"
        }
        else{
            USERDATA.is_vip = "未开通"
        }
        return USERDATA
    }
    else{
        Logout()
    }
}

export async function ScanQRLogin(qrkey){
    var ret = (await axios.get(Config.SERVER_URL + Config.API_MAP.ScanQRLogin + CookieTool.getCookie("token") + "/" + CookieTool.getCookie("username") + "/" + qrkey)).data
    if (ret.success) {
        notyf.success(ret.message)
        return true
    }
    else {
        notyf.error(ret.message)
        return false
    }
    return false
}