import assert from "node:assert";
import { jest, expect, describe, it } from "@jest/globals";


import { YemotApi } from "../dist/index.js";
import { mocks } from "./mock.js";

mocks();

export const success_obj = {
    yemotAPIVersion: 6,
    responseStatus: "OK"
};

describe("tset", () => {
    const yemotApi = new YemotApi("0773137770", "1234");

    it("Login", async () => {

        expect(yemotApi.login()).resolves.toBeUndefined();
    })

    it("Set password", async () => {

        const r = await yemotApi.set_password("1234", "5678");

        expect(r.data).toEqual(success_obj);
    })

    describe('logout', () => {

        it('calls exec', async () => {
            const execSpy = jest.spyOn(yemotApi, 'exec')
                .mockResolvedValueOnce({});

            await yemotApi.logout();

            expect(execSpy).toHaveBeenCalledWith('Logout');
        });

    });
});


describe('YemotApi', () => {

    let yemotApi;
  
    beforeEach(() => {
      yemotApi = new YemotApi('username', 'password');
    });
  
    describe('login', () => {
  
      it('logs in successfully', async () => {

        const execSpy = jest.spyOn(yemotApi, 'exec').mockResolvedValueOnce({}); 

        await expect(yemotApi.login()).resolves.not.toThrow();

        expect(execSpy).toHaveBeenCalledWith('Login', {
          username: 'username', 
          password: 'password'
        });
      });
  
    });
  
    describe('set_password', () => {
      
      it('calls exec with correct params', async () => {

        const execSpy = jest.spyOn(yemotApi, 'exec')
          .mockResolvedValueOnce({data: {responseStatus: 'OK'}});
  
        await yemotApi.set_password('old', 'new');
  
        expect(execSpy).toHaveBeenCalledWith('SetPassword', {
          password: 'old',
          newPassword: 'new' 
        });
      });
  
    });
  
    describe('copy_files', () => {
  
      it('calls exec with correct params', async () => {
        const execSpy = jest.spyOn(yemotApi, 'exec')
          .mockResolvedValueOnce({});
  
        await yemotApi.copy_files('target', ['file1', 'file2']);
  
        expect(execSpy).toHaveBeenCalledWith('FileAction', {
          action: 'copy',
          target: 'ivr2:target',
          what0: 'ivr2:file1',
          what1: 'ivr2:file2'
        });
      });
  
    });

    describe('logout', () => {

        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.logout();
        
          expect(execSpy).toHaveBeenCalledWith('Logout');
        });
      
      });
      
      describe('get_ivr_tree', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.get_ivr_tree('path');
        
          expect(execSpy).toHaveBeenCalledWith('GetIvrTree', {
            path: 'ivr2:path'
          });
        });
      
      });
      
      describe('get_incoming_calls', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.get_incoming_calls();
        
          expect(execSpy).toHaveBeenCalledWith('GetIncomingCalls');
        });
      
      });
      
      describe('get_incoming_sum', () => {
      
        it('calls exec with params', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.get_incoming_sum('from', 'to');
        
          expect(execSpy).toHaveBeenCalledWith('GetIncomingSum', {
            from: 'from',
            to: 'to'
          });
        });
      
      }); 
      
      describe('get_session', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.get_session();
        
          expect(execSpy).toHaveBeenCalledWith('GetSession');
        });
      
      });
      
      describe('run_campaign', () => {
      
        it('calls exec with params', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
        
          await yemotApi.run_campaign(123, ['phone1', 'phone2'], 'callerId');
        
          expect(execSpy).toHaveBeenCalledWith('RunCampaign', {
            templateId: 123,
            phones: 'phone1:phone2',
            callerId: 'callerId'
          });
        });
      
      }); 
      
      describe('create_ext', () => {
      
        it('calls exec and upload_txt_file', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
      
          const uploadSpy = jest.spyOn(yemotApi, 'upload_txt_file')
            .mockResolvedValueOnce({});
      
          const ini = {
            'foo': 'bar'
          };
        
          await yemotApi.create_ext('path', ini);
        
          expect(execSpy).toHaveBeenCalledWith('UpdateExtension', {
            path: 'ivr2:path'
          });
      
          expect(uploadSpy).toHaveBeenCalledWith('path/ext.ini', 'foo=bar');
        });
      
      });
      
      describe('upload_ini_file', () => {
      
        it('calls upload_txt_file', async () => {
          const uploadSpy = jest.spyOn(yemotApi, 'upload_txt_file')
            .mockResolvedValueOnce({});
      
          const ini = {
            'foo': 'bar'  
          };
      
          await yemotApi.upload_ini_file('path', ini);
          
          expect(uploadSpy).toHaveBeenCalledWith('path', 'foo=bar');
        });
      
      });
      
      describe('upload_txt_file', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
      
          await yemotApi.upload_txt_file('path', 'contents');
      
          expect(execSpy).toHaveBeenCalledWith('UploadTextFile', {
            what: 'ivr2:path',
            contents: 'contents'
          });
        });
      
      });
      
      describe('upload_file', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
      
          await yemotApi.upload_file('path', 'file');
      
          expect(execSpy).toHaveBeenCalledWith('UploadFile', {
            path: 'path',
            convertAudio: 0,
            file: 'file'
          });
        });
      
      });
      
      describe('download_file', () => {
      
        it('calls exec', async () => {
          const execSpy = jest.spyOn(yemotApi, 'exec')
            .mockResolvedValueOnce({});
      
          await yemotApi.download_file('path');
      
          expect(execSpy).toHaveBeenCalledWith('DownloadFile', {
            path: 'path'
          });
        });
      
      });
  
  });