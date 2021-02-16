/**
 *  את הקובץ עזה לא אני כתבתי,  אלא שלמה ווגשל.
 *  אפשר להעתיק מפה מה שעדיין לא הכנסתי.
 */


const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const FormData = require('form-data');

module.exports = class YmApi {
    constructor(username, password, setToken = true, ymLink = 'ym') {
        this.username = username;
        this.password = password;
        this.setToken = setToken;
        this.URL = 'https://www.call2all.co.il/' + ymLink + '/api/';
    }

    get token() {
        if (this.setToken) {
            if (!this.tokenPromise) {
                this.tokenPromise = new Promise((resolve, reject) => {
                    let url = this.URL + 'Login?' + 'username=' + this.username + '&password=' + encodeURIComponent(this.password);
                    fetch(url, {method: 'get'}).then(res => res.json()).then(json => {
                        // console.log(json);
                        if (json.token) {
                            resolve(json.token);
                        } else {
                            reject('שם משתמש או סיסמא שגויים.');
                        }
                    });
                })
            }
        } else {
            this.tokenPromise = new Promise((resolve, reject) => {
                let url = this.username + ':' + encodeURIComponent(this.password);
                resolve(url);
            })
        }
        return this.tokenPromise;
    }

    connecting(action, body) {
        return this.token.then( token => {
            let params = new FormData();
            params.append('token', token);
            if (body) {
                for (let i in body) {
                    if (!(action === 'UploadFile' && i === 'file')) {
                        params.append(i, typeof body[i] !== "object" ? body[i] : JSON.stringify(body[i]));
                    } else {
                        params.append('file', body[i], {
                            contentType: 'audio/wav',
                            filename: 'file',
                        });
                    }
                }
            }
            let url = this.URL + action;
            return fetch(url, {
                method: 'POST',
                body: params,
                headers : params.getHeaders()
            }).then(res => {
                // console.log(res);
                if (action !== 'DownloadFile' && res.status !== 404){
                    return res.json();
                }else{
                    return res;
                }
            }).catch(console.error);
        });
    }

    connecting2(action, body) {
        // console.log('action ' + action);
        return this.token.then( token => {
            let params = new URLSearchParams();
            // params.append('token', token);
            if (body) {
                for (let i in body) {
                    params.append(i, body[i]);
                }
            }
            let url = this.URL + '/' + action;
            return fetch(url, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },

            }).then(res => {return res.json()}).catch(console.error); //console.log(res) ;
        });
    }
    Logout(){
        return this.connecting('Logout');
    }
    RunCampaign(templateId, phones, callerId = false){
        let body = {
            templateId : templateId,
            phones : phones,
        };
        if (callerId){
            body['callerId'] = callerId;
        }
        return this.connecting('RunCampaign', body);
    }
    GetTemplateEntries(templateId){
        return this.connecting('GetTemplateEntries', {'templateId' : templateId});
    }

    GetTransactions(from, limit){
        return this.connecting('GetTransactions', {'from' : from, 'limit' : limit});
    }

    TransferUnits(destination, amount){
        return this.connecting('TransferUnits', {'destination' : destination, 'amount' : amount});
    }

    DownloadFile(path){
        return this.connecting('DownloadFile', {'path' : path});
    }

    UploadFile(path, file, convertAudio = 0){
        let body = {'path' : path, 'convertAudio' : convertAudio, 'file' : file};
        return this.connecting('UploadFile', body);
    }

    GetTemplates(){
        return this.connecting('GetTemplates');
    }

    GetActiveCampaigns(){
        return this.connecting('GetActiveCampaigns');
    }

    GetSession(){
        return this.connecting('GetSession');
    }

    CreateTemplate(){
        return this.connecting('CreateTemplate');
    }

    UpdateTemplate(templateId, body = {}){
        body['templateId'] = templateId;
        return this.connecting('UpdateTemplate', body);
    }

    UploadPhoneList(templateId, body = {}){
        body['templateId'] = templateId;
        return this.connecting('UploadPhoneList', body);
    }

    GetTemplates2(){
        return this.connecting2('GetTemplates');
    }

    GetIvrTree(path){
        return this.connecting('GetIvrTree', {path : 'ivr2:' + path});
    }

    GetIVR2Dir(path){
        return this.connecting('GetIVR2Dir', {path : 'ivr2:' + path});
    }

    
    GetIncomingCalls(){
        return this.connecting('GetIncomingCalls');
    }

    GetTextFile(what){
        return this.connecting('GetTextFile', {'what' : 'ivr2:' + what});
    }

    UploadTextFile(what, contents){
        return this.connecting('UploadTextFile', {'what' : 'ivr2:' + what, contents : contents});
    }

    UpdateExtension(path){
        return this.connecting('UpdateExtension', {'path' : 'ivr2:' + path});
    }

    FileAction(action, what, target){ //action = [move, copy, delete]
        let body = {action : action, 'target' : 'ivr2:' + target};
        if (typeof what === 'object'){
            for (let i = 0; i < what.length;i++) {
                body['what' + i] = 'ivr2:' + what[i];
            }
        }else{
            body['what'] =  'ivr2:' + what;
        }
        return this.connecting('FileAction', body);
    }

    CallAction(action, ids){ //action = [move, copy, delete]
        if (typeof ids === "object"){
            ids = ids.join(':');
        }
        let body = {action : action, 'ids' : ids};
        return this.connecting('CallAction', body);
    }

};