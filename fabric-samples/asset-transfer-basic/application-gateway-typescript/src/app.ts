/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import express, { Express, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import {MedicalRecord} from './medicalRecord';
import {OptionModel} from './OptionModel';
import {DoctorComment} from './DoctorComment';
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');

const config = require('./config');

const mspId = envOrDefault('MSP_ID', config.blockchainSetting.MSP_ID);

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', config.blockchainSetting.FqdnDomain));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', config.blockchainSetting.User, 'msp', 'keystore'));

// Path to user certificate.
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', config.blockchainSetting.User, 'msp', 'signcerts', 'cert.pem'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', config.blockchainSetting.PeerNodeFqdn, 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', config.blockchainSetting.GatewayEndpoint);

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', config.blockchainSetting.PeerNodeFqdn);

const utf8Decoder = new TextDecoder();



async function main(): Promise<void> {

    await displayInputParameters();


    try {
        /*const client = await newGrpcConnection();

        const gateway = connect({
            client,
            identity: await newIdentity(),
            signer: await newSigner(),
            // Default timeouts for different gRPC calls
            evaluateOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 15000 }; // 15 seconds
            },
            submitOptions: () => {
                return { deadline: Date.now() + 5000 }; // 5 seconds
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        // Get a network instance representing the channel where the smart contract is deployed.
        var network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        var contract = network.getContract(chaincodeName);

        // Initialize a set of MedicalRecords data on the ledger using the chaincode 'InitLedger' function.
        var option = new OptionModel();
        console.log(option);
        var triesCounter = 0;
         while(triesCounter < 5)
        {
            console.log(`try #${triesCounter}`);
            try 
            {
                var xx = await initLedger(contract);
                console.log(xx);
                break;  // 'return' would work here as well
            } 
            catch (err) {
               console.log(err);
            }
            triesCounter ++;
        }*/

        // Return all the current MedicalRecords on the ledger.
        //let triesCounter = 0;
        /*var rcd = {
              ID: 'record1656347223368',
              PID: 'N123****32',
              ClinicID: 'B0001',
              JobType: '服務業-空服員',
              Name: '王美麗',
              Birth: '1987/07/20',
              Sex: 'F',
              Btp: 'A',
              Address: '台北市台北市文山區興隆路三段30號',
              Email: 'beauty@gmail.com',
              Phone: '0912345678',
              CDvin: '01',
              CDVinID: '01',
              Doctor: '62b4a715faaa5082f675b8b0',
              Description: 'test',
              Smoke: '是',
              Drink: '是',
              BeteNut: '是',
              PotentialDise: '無',
              Surgery: '是',
              OTC: '是',
              DrugSensitive: '是',
              SleepSituation: '睡足7-8小時',
              Travel: '是',
              DoctorComment: ''
            };
        while(triesCounter < 5)
        {
            console.log(`try #${triesCounter}`)
            try 
            {
                await uploadMedData(contract,rcd);
                break;  // 'return' would work here as well
            } 
            catch (err) {
               console.log(err);
            }
            triesCounter ++;
        }*/


        /*dotenv.config();

        const app: Express = express();
        const port = process.env.PORT;

        app.get('/', (req: Request, res: Response) => {
          res.send('Express + TypeScript Server');
        });

        app.listen(port, () => {
          console.log(`[server]: Server is running at https://localhost:${port}`);
        });*/
        /*var triesCounter2 = 0;
        while(triesCounter2 < 5)
        {
            console.log(`try #${triesCounter2}`)
            try 
            {
                var re : any = await GetAllMedicalRecords(contract);
                console.log(JSON.stringify(re, null, 4));
                break;  // 'return' would work here as well
            } 
            catch (err) {
               console.log(err);
            }
            triesCounter2 ++;
        }*/

        const session = require('express-session');
        var createError = require('http-errors');
        var express = require('express');
        var path = require('path');
        var cookieParser = require('cookie-parser');
        var logger = require('morgan');

        var compression = require('compression');
        var bodyParser = require('body-parser');
        var async = require('async');
        var tempData = require('tempdata');

        var app = express();
        app.use(session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        }));

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'pug');

        app.use(compression()); //Compress all routes , for the purpose of reducing client's time of getting and loading pages
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(tempData);


        //Set up mongoose connection
        var mongoose = require('mongoose');

        const { MongoClient, ServerApiVersion } = require('mongodb');
        const common_db_url = "mongodb+srv://common:common@cluster0.udixre9.mongodb.net/?retryWrites=true&w=majority";
        const client1 = new MongoClient(common_db_url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        
        var conn2 = mongoose.createConnection("mongodb+srv://common:common@cluster0.udixre9.mongodb.net/commonDB?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

       var Clinic = conn2.model('clinic', new mongoose.Schema(
          {
            Hid: {type: String},
            Name: {type: String},
            Address: {type: String},
            Tel: {type: Date}
          }),'clinic');

       var Division = conn2.model('division',new mongoose.Schema(
          {
            Did: {type: String},
            DName: {type: String},
            Cid: {type: String}
          }),'division');

       var Investigation = conn2.model('ItemSetting', new mongoose.Schema(
            {
                Description:{ type: String},
                Type:{type: String},
                HasComment:{type:String},
                PlaceHolder:{type:String},
                Setting:{type: String },
                ClassID:{type:String}
            }), 'ItemSetting');

       var User = conn2.model('user', new mongoose.Schema(
            {
                _id : {type: mongoose.Schema.Types.ObjectId},
                JobType : {type: String},
                Name:{type: String},
                PID:{type: String},
                Birth:{type: String},
                Address:{type: String},
                Email:{type: String},
                Phone:{type: String},
                Btp:{type: String},
                Sex:{type: String},
                Acct:{type: String},
                Division:{type: String},
                HID:{type: String},
                Hospital:{type: String},
                Pwd:{type: String},
                Identity:{type: String},
                IsAdmin:{type: String},
                Did:{type: String}
            }), 'user');

       var blockChainMapping = conn2.model('blockchainMapping', new mongoose.Schema(
           {
                Cid:{type:String},
                Did:{type:String},
                RecordID:{type:String}

           }), 'blockchainMapping');


        app.get('/', function (req, res, next) {
            res.redirect('/login');
        });
        app.get('/login', function(req,res,next){
            res.render('login', {error: false});

        });

        /* GET users listing. */
        app.post('/login', function (req, res, next) {
            //console.log(req.body.username);
            //console.log(req.body.identity);
             client1.connect(err => {
                      const collection = client1.db("commonDB").collection("user");
                      collection.find({
                            $and:[
                                {Acct:req.body.username},
                                {Pwd:req.body.password},
                                {Identity:req.body.identity}
                            ]
                        })
                      .toArray(function(err, result){
                        console.log("查詢結果");
                        console.log(result);
                        if(err){
                            console.log(err);
                            res.redirect('/login');
                        }
                        if(result.length > 0){
                            req.session.loggedin = true;
                            req.session.Name = result[0].Name;
                            req.session.Sex = result[0].Sex;
                            req.session.IsAdmin = result[0].IsAdmin;
                            req.session.Identity = result[0].Identity;
                            req.session.Hospital = result[0].Hospital;
                            req.session.HID = result[0].HID;
                            req.session.Division = result[0].Division;
                            req.session.Pid = result[0].PID;
                            req.session.Birth = result[0].Birth;
                            req.session.Btp = result[0].Btp;
                            req.session.Email = result[0].Email;
                            req.session.JobType = result[0].JobType;
                            req.session.Phone = result[0].Phone;
                            req.session.Address = result[0].Address;
                            req.session.Did = result[0].Did;
                            req.session.UserId = result[0]._id;
                            res.redirect('/catalog');
                        }
                        else{
                            res.render('login', {error: true});
                        }
                        client1.close();
                    });
              });
        });
        app.post('/logout', function(req, res, next){
            req.session.loggedin = false;
            req.session.Name = null;
            req.session.Sex = null;
            req.session.IsAdmin = null;
            req.session.Identity = null;
            req.session.Hospital = null;
            req.session.HID = null;
            req.session.Division = null;
            req.session.Pid = null;
            req.session.Birth = null;
            req.session.Btp = null;
            req.session.Email = null;
            req.session.JobType = null;
            req.session.Phone = null;
            req.session.Address = null;
            req.session.Did = null;
            req.session.UserId = null;
            res.redirect('/login');
        });

       app.get('/catalog', async function(req,res,next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            var client = await newGrpcConnection();

            var gateway = connect({
                client,
                identity: await newIdentity(),
                signer: await newSigner(),
                // Default timeouts for different gRPC calls
                evaluateOptions: () => {
                    return { deadline: Date.now() + 5000 }; // 5 seconds
                },
                endorseOptions: () => {
                    return { deadline: Date.now() + 15000 }; // 15 seconds
                },
                submitOptions: () => {
                    return { deadline: Date.now() + 5000 }; // 5 seconds
                },
                commitStatusOptions: () => {
                    return { deadline: Date.now() + 60000 }; // 1 minute
                },
            });
             var network = gateway.getNetwork(channelName);
             var contract = network.getContract(chaincodeName);
             try
             {
                var results :any = await GetAllMedicalRecords(contract);
                if(req.session.Identity == 'Normal'){
                    results = results.filter(function(elem:any){
                        return elem.PID == req.session.Pid;
                    });
                }
                else if(req.session.IsAdmin == "F"){
                    results = results.filter(function(elem:any){
                        return elem.CDvin == req.session.Division;
                    });
                }
                console.log(results);
                var count = (results instanceof Array) && results != null ? results.length : 0;
                var userTitle = req.session.Sex == "M" ? "先生" : "小姐";
                res.render('index', { title: '醫療通', error: null, data:{ record_count: count , login_user: req.session.Name, user_title:userTitle }  });  
             }
             catch(err){
                return next(err);
             }
             finally{
                 gateway.close();
                 client.close();
             }
       });

        app.post('/checkPermission', function(req,res,next){
            res.send(req.session.IsAdmin);
        });
        app.get('/catalog/medicalrecords', async function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }

            var client = await newGrpcConnection();

            var gateway = connect({
                client,
                identity: await newIdentity(),
                signer: await newSigner(),
                // Default timeouts for different gRPC calls
                evaluateOptions: () => {
                    return { deadline: Date.now() + 5000 }; // 5 seconds
                },
                endorseOptions: () => {
                    return { deadline: Date.now() + 15000 }; // 15 seconds
                },
                submitOptions: () => {
                    return { deadline: Date.now() + 5000 }; // 5 seconds
                },
                commitStatusOptions: () => {
                    return { deadline: Date.now() + 60000 }; // 1 minute
                },
            });
            var network = gateway.getNetwork(channelName);
            var contract = network.getContract(chaincodeName);
            var queryResult : Array<MedicalRecord> = [];
            var queryParameters = {
                Name:"",
                HcardId:"",
                Pid:"",
                ClinicId:"",
                DivisionId:"",
                DoctorId:"",
                ConsultationDate:""
            };
            var tempVal = req.tempData.get('queryParameters');
            if (tempVal !=null)
                queryParameters = JSON.parse(tempVal);
                console.log("parse 後結果");
                console.log(queryParameters);
            try
             {
                var result:any = await GetAllMedicalRecords(contract);
                console.log("撈出所有病歷資料");
                console.log(result);
                queryResult = (result instanceof Array) && result != null ? result : [];
                if(req.session.Identity == 'Normal'){
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.PID == req.session.Pid;
                    });

                }
                else if(req.session.IsAdmin == "F")
                {
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.CDvin == req.session.Division;
                    });

                    if(queryParameters.Name !=""){
                        queryResult = queryResult.filter(function(elem:any){
                            return elem.Name == queryParameters.Name;
                        });
                    }
                    /*if(queryParameters !=null && queryParameters.HcardId !=""){
                        
                    }*/
                    if(queryParameters.Pid !=""){
                        queryResult = queryResult.filter(function(elem:any){
                            return elem.PID == queryParameters.Pid;
                        });
                    }
                }

                if(queryParameters.ClinicId != ""){
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.ClinicID == queryParameters.ClinicId;
                    });
                }
                if(queryParameters.DivisionId != ""){
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.CDVinID == queryParameters.DivisionId;
                    });
                }
                if(queryParameters.DoctorId !=""){
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.DoctorId == queryParameters.DoctorId;
                    });
                }
                if(queryParameters.ConsultationDate !=""){
                    queryResult = queryResult.filter(function(elem:any){
                        return elem.ConsultationDate == queryParameters.ConsultationDate;
                    });
                }
               
                 Clinic.find(function(err, result){
                    if(err){
                        console.log("錯誤訊息");
                        return next(err);
                    }
                    console.log("list 頁查詢")
                    //console.log(result);
                    for(var i in queryResult){
                        queryResult[i].Name =  queryResult[i].Name.length <= 2 ?  queryResult[i].Name.charAt(0)+"O" :  queryResult[i].Name;
                        queryResult[i].Name =  queryResult[i].Name.length == 3 ?  queryResult[i].Name.charAt(0) + "O" +  queryResult[i].Name.charAt(2) :  queryResult[i].Name;
                        var maskChar = "O";
                        queryResult[i].Name =  queryResult[i].Name.length > 3 ?  queryResult[i].Name.charAt(0) + maskChar.repeat( queryResult[i].Name.length-2) +  queryResult[i].Name.charAt( queryResult[i].Name.length-1):  queryResult[i].Name;
                    }
                    var groupList = queryResult.reduce(function(groups, item) {
                        const val = item['Clinic']
                        groups[val] = groups[val] || []
                        groups[val].push(item)
                        return groups
                      }, {});
                    var orderedResult = [] as Array<MedicalRecord>;
                    for(var item in groupList){
                        groupList[item].sort(function(a, b){ return Date.parse(b.ConsultationDate) - Date.parse(a.ConsultationDate) });
                        for(var idx in groupList[item]){
                            orderedResult.push(groupList[item][idx])
                        }
                    }
                    res.render('medical_records', { title: '電子病歷列表', records: orderedResult , Identity:req.session.Identity, clinics:result , queryParams: queryParameters  });
                });
             }
             catch(err){
                return next(err);
             }
             finally{
                 gateway.close();
                 client.close();
             }

        });


         app.post('/catalog/medicalrecords', function(req, res, next){
            var queryParameters = {
                Name:"",
                HcardId:"",
                Pid:"",
                ClinicId:"",
                DivisionId:"",
                DoctorId:"",
                ConsultationDate:""
            };
            queryParameters.Name = req.body.name;
            queryParameters.HcardId = req.body.hcardid;
            queryParameters.Pid = req.body.pid;
            queryParameters.ClinicId = req.body.clinic;
            queryParameters.DivisionId = req.body.division;
            queryParameters.DoctorId = req.body.doctor;
            queryParameters.ConsultationDate = req.body.consultation_date;
            console.log("裝好 tempdata");
            console.log(JSON.stringify(queryParameters,null,4));
            req.tempData.set("queryParameters", JSON.stringify(queryParameters));
            res.redirect("/catalog/medicalrecords");

         });




         // GET request to update medicalrecord
        app.get('/medicalrecord/update', function(req,res,next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            var callback = function(err, result){
                console.log(result);
            };
            async.parallel({
                clinics: function(callback) {
                    Clinic.find(callback);
                },
                investigations: function(callback){
                    Investigation.find(callback);
                }
                
            }, async function(err, results) {
                if (err) { 
                    console.log('create medical record get error:' + err);
                    return ;
                }
                //console.log("診所");
                //console.log(results);
                //console.log(results.clinics);
                //console.log(results.investigations);

                // 從區塊鏈查看有沒有資料, 有的話先把資料撈出來, 找最新的一筆填寫結果
                var client = await newGrpcConnection();

                var gateway = connect({
                    client,
                    identity: await newIdentity(),
                    signer: await newSigner(),
                    // Default timeouts for different gRPC calls
                    evaluateOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    endorseOptions: () => {
                        return { deadline: Date.now() + 15000 }; // 15 seconds
                    },
                    submitOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    commitStatusOptions: () => {
                        return { deadline: Date.now() + 60000 }; // 1 minute
                    },
                });

                 var network = gateway.getNetwork(channelName);
                 var contract = network.getContract(chaincodeName);
                 var queryResult  = {} as MedicalRecord;
                 try
                 {
                    if(parseInt(req.query.id,10) == NaN){
                        console.log('query string 有誤');
                        return;
                    }
                    var result:any = await ReadMedicalRecordByID(contract, req.query.id);
                    console.log("更新表單時讀取的資料");
                    console.log(JSON.stringify(result, null,4));
                    if(result === undefined || result == null){
                        next(createError(404));
                    }
                    else{
                        queryResult = result;
                        var personalData = {
                            Name:queryResult.Name,
                            Sex: queryResult.Sex,
                            Birth: queryResult.Birth,
                            Email: queryResult.Email,
                            BloodType: queryResult.Btp,
                            JobType:queryResult.JobType,
                            Phone: queryResult.Phone.substring(0,3) + '*****' + queryResult.Phone.charAt(queryResult.Phone.length-2) + queryResult.Phone.charAt(queryResult.Phone.length-1),
                            Address:queryResult.Address,
                            Identity:queryResult.Identity,
                            Pid : queryResult.PID.substring(0,4) + '****' + queryResult.PID.charAt(queryResult.PID.length -2) + queryResult.PID.charAt(queryResult.PID.length -1)
                        }
                        var identity = req.session.Identity;
                        var isAdmin = req.session.IsAdmin;
                        var canUpdate = req.session.HID == queryResult.ClinicID && req.session.Did == queryResult.CDVinID && req.session.UserId == queryResult.DoctorId;
                        res.render('medicalrecord_form', { title: '電子病歷資料', existedMedicaRecord:queryResult, pdata: personalData, clinics: results.clinics, investigations:results.investigations, mode:'Update', Identity: identity, IsAdmin:isAdmin , CanUpdate: canUpdate });
                    }
                 }
                 catch(err){
                    return next(err);
                 }
                 finally{
                     gateway.close();
                     client.close();
                 }
            });

        });
        

        // POST request to update medicalrecord
        app.post('/medicalrecord/update', [
                (req, res, next) => {
                    console.log("post 成功, 準備更新");
                    next();
                },
                // Sanitize fields.
                sanitizeBody('doctorcomment').escape(), 
                // Process request after validation and sanitization.
                (req, res, next) => {

                    // Extract the validation errors from a request.
                    const errors = validationResult(req);

                   var callback = function(err, result){
                        console.log(result);
                    };
                    async.parallel({
                        clinics: function(callback) {
                            Clinic.find(callback);
                        },
                        investigations: function(callback){
                            Investigation.find(callback);
                        }
                        
                    }, async function(err, results) {
                        if (err) { 
                            console.log('create medical record get error:' + err);
                            return ;
                        }
                        //console.log("診所");
                        //console.log(results);
                        //console.log(results.clinics);
                        //console.log(results.investigations);

                        // 從區塊鏈查看有沒有資料, 有的話先把資料撈出來, 找最新的一筆填寫結果
                        var client = await newGrpcConnection();

                        var gateway = connect({
                            client,
                            identity: await newIdentity(),
                            signer: await newSigner(),
                            // Default timeouts for different gRPC calls
                            evaluateOptions: () => {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            endorseOptions: () => {
                                return { deadline: Date.now() + 15000 }; // 15 seconds
                            },
                            submitOptions: () => {
                                return { deadline: Date.now() + 5000 }; // 5 seconds
                            },
                            commitStatusOptions: () => {
                                return { deadline: Date.now() + 60000 }; // 1 minute
                            },
                        });

                         var network = gateway.getNetwork(channelName);
                         var contract = network.getContract(chaincodeName);
                         var queryResult  = {} as MedicalRecord;
                         var personalData;
                         var identity = "";
                         try
                         {
                            if(parseInt(req.query.id,10) == NaN){
                                console.log('query string 有誤');
                                return;
                            }
                            console.log(req.query.id);
                            //console.log(req.body.doctorcomment);
                            var result:any = await ReadMedicalRecordByID(contract, req.query.id);
                            console.log("更新表單時讀取的資料");
                            console.log(JSON.stringify(result, null,4));
                            if(result === undefined || result == null){
                                next(createError(404));
                            }
                            else{
                                console.log("醫生診斷資料");
                                console.log(req.body.doctorcomment);
                                queryResult = result as MedicalRecord;
                                personalData = {
                                    Name:queryResult.Name,
                                    Sex: queryResult.Sex,
                                    Birth: queryResult.Birth,
                                    Email: queryResult.Email,
                                    BloodType: queryResult.Btp,
                                    JobType:queryResult.JobType,
                                    Phone: queryResult.Phone.substring(0,3) + '*****' + queryResult.Phone.charAt(queryResult.Phone.length-2) + queryResult.Phone.charAt(queryResult.Phone.length-1),
                                    Address:queryResult.Address,
                                    Identity:queryResult.Identity,
                                    Pid : queryResult.PID.substring(0,4) + '****' + queryResult.PID.charAt(queryResult.PID.length -2) + queryResult.PID.charAt(queryResult.PID.length -1)
                                }
                                identity = req.session.Identity;
                            }
                         }
                         catch(err){
                            return next(err);
                         }

                         if (!errors.isEmpty()) {
                             gateway.close();
                             client.close();
                            // There are errors. Render form again with sanitized values/error messages.
                            if(req.body.doctorcomment !='' && req.body.doctorcomment != null){
                                var doctorComment = {Comment:"",CommentDate:"",Clinic:"",Division:"",Doctor:""} as DoctorComment;
                                doctorComment.Comment = req.body.doctorcomment;
                                doctorComment.CommentDate = new Date().toISOString().slice(0, 10);
                                doctorComment.Clinic = req.session.Hospital;
                                doctorComment.Division = req.session.Division;
                                doctorComment.Doctor = req.session.Name;
                                queryResult.DoctorComment.push(doctorComment);
                            }
                            res.render('medicalrecord_form', { title: '電子病歷資料', existedMedicaRecord:queryResult, pdata: personalData, clinics: results.clinics, investigations:results.investigations, mode:'Update', Identity: identity,errors: errors.array() });
                            return;
                         }
                         else{
                             // Data from form is valid. Update the record onto blockchain
                            if(req.body.doctorcomment !='' && req.body.doctorcomment != null){
                                var doctorComment = {Comment:"",CommentDate:"",Clinic:"",Division:"",Doctor:""} as DoctorComment;
                                doctorComment.Comment = req.body.doctorcomment;
                                doctorComment.CommentDate = new Date().toISOString().slice(0, 10);
                                doctorComment.Clinic = req.session.Hospital;
                                doctorComment.Division = req.session.Division;
                                doctorComment.Doctor = req.session.Name;
                                queryResult.DoctorComment.push(doctorComment);
                            }
                            console.log("讀取要被更新的資料");
                            console.log(JSON.stringify(queryResult, null, 4));
                            var result:any = await UpdateExistentMedicalRecord(contract, queryResult);
                            console.log("更新成功!");
                            console.log(result);
                            gateway.close();
                            client.close();
                            res.redirect('/medicalrecord/update?id=' + req.query.id);
                         }
                      });
                    }
            ]);

        
        app.get('/catalog/healthreport', function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            res.render('health_reports', { title: '健檢報告查詢', error: null, data:{ count: 0 }  });
        });    

        app.get('/catalog/medicalreport', function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            res.render('medical_reports', { title: '醫療報告查詢', error: null, data:{ count: 0 }  });
        });   

        app.get('/catalog/consultation_process', function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            res.render('consultation_process', { title: '看診進度查詢', error: null, data:null  });
        });   


        app.get('/medicalrecord/create', function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            if(req.session.Identity != 'Normal'){
                res.redirect('/catalog');
            }
            var callback = function(err, result){
                        console.log(result);
                    };
            async.parallel({
                clinics: function(callback) {
                    Clinic.find(callback);
                },
                investigations: function(callback){
                    Investigation.find(callback);
                }
                
            }, async function(err, results) {
                if (err) { 
                    console.log('create medical record get error:' + err);
                    return ;
                }
                console.log("診所");
                console.log(results);
                //console.log(results.clinics);
                //console.log(results.investigations);

                // 從區塊鏈查看有沒有資料, 有的話先把資料撈出來, 找最新的一筆填寫結果
                var client = await newGrpcConnection();

                var gateway = connect({
                    client,
                    identity: await newIdentity(),
                    signer: await newSigner(),
                    // Default timeouts for different gRPC calls
                    evaluateOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    endorseOptions: () => {
                        return { deadline: Date.now() + 15000 }; // 15 seconds
                    },
                    submitOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    commitStatusOptions: () => {
                        return { deadline: Date.now() + 60000 }; // 1 minute
                    },
                });

                 var network = gateway.getNetwork(channelName);
                 var contract = network.getContract(chaincodeName);
                 var queryResult : Array<MedicalRecord> = [];
                 var latestMedicalRecord ;
                 try
                 {
                    var result:any = await GetAllMedicalRecords(contract);
                    console.log("新增表單時查詢是否有最近資料");
                    console.log(JSON.stringify(result, null,4));
                    queryResult = (result instanceof Array) && result != null ? result : [];
                        if(queryResult.length > 0){
                        queryResult = queryResult.filter(function(elem:any){
                            return elem.PID == req.session.Pid;
                        });
                        queryResult.sort(function(a, b){ return parseInt(b.ID.replace('record','')) - parseInt(a.ID.replace('record','')) });
                        latestMedicalRecord = queryResult[0];
                        console.log("儲存結果");
                        console.log(latestMedicalRecord);
                    }
                 }
                 catch(err){
                    return next(err);
                 }
                 finally{
                     gateway.close();
                     client.close();
                 }

            var personalData = {
                    Name:req.session.Name,
                    Sex: req.session.Sex,
                    Birth: req.session.Birth,
                    Email: req.session.Email,
                    BloodType: req.session.Btp,
                    JobType:req.session.JobType,
                    Phone: req.session.Phone,
                    Address:req.session.Address,
                    Identity:req.session.Identity,
                    Pid : req.session.Pid.substring(0,4) + '****' + req.session.Pid.charAt(req.session.Pid.length -2) + req.session.Pid.charAt(req.session.Pid.length -1)
                }
                if(latestMedicalRecord === undefined){
                    res.render('medicalrecord_form', { title: '填寫電子病歷', pdata: personalData, clinics: results.clinics, investigations:results.investigations, Identity:personalData.Identity, IsAdmin: req.session.IsAdmin });
                }
                else
                    res.render('medicalrecord_form', { title: '填寫電子病歷', existedMedicaRecord:latestMedicalRecord, pdata: personalData, clinics: results.clinics, investigations:results.investigations,Identity:personalData.Identity , IsAdmin: req.session.IsAdmin });
            });
        });

    app.post('/getDivision', function(req,res,next){
        Division.find({Cid:req.body.clinicId}, function(err, result){
            if(err){
                next(err);
            }
            else{
                var data = {divisions:result};
                res.send(JSON.stringify(data));
            }
        });
    });
    app.post('/getDoctor', function(req,res,next){
        User.find({
            $and:[
                {HID:req.body.clinicId},
                {Did:req.body.divisionId}
            ]}
            , function(err, result){
            if(err){
                next(err);
            }
            else{
                var data = {doctors:result};
                res.send(JSON.stringify(data));
            }
        });
    });

    // 1. 寫入 common db 的 blockchainMapping table
    // 2. 寫入 blockchain network
    app.post('/medicalrecord/create', [

         (req, res, next) => {
            console.log("送出資料");
            console.log(req.body);
            //console.log(typeof req.body.OP4);
            //console.log(req.body.OP4);
        if(!(req.body.OP4 instanceof Array) && typeof req.body.OP4 !== 'string' && typeof req.body.OP4==='undefined'){
            res.redirect('/info?text=疾病史或遺傳性疾病未勾選');
        }
        req.body.OP4=new Array(req.body.OP4);
        next();
    },

    // Validate fields.
    body('description', '看診目的必須填寫').trim().isLength({ min: 1 }),
    body('consultation_date', '看診日期必須選擇').trim().isLength({ min: 1 }),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    async (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        var rId = `record${Date.now()}`;
        // Create a record of blockchain's id mapping
        var blkchainMapping = new blockChainMapping(
          { Cid: req.body.clinic,
            Did: req.body.division,
            RecordID: rId
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                clinics: function(callback) {
                    Clinic.find(callback);
                },
                investigations: function(callback){
                    Investigation.find(callback);
                }

            }, function(err, results) {
                if (err) { 
                    console.log('新增電子病歷失敗:' + err);
                    return next(err); 
                }
                var personalData = {
                    Name:req.session.Name,
                    Sex: req.session.Sex,
                    Birth: req.session.Birth,
                    Email: req.session.Email,
                    BloodType: req.session.Btp,
                    JobType:req.session.JobType,
                    Phone: req.session.Phone,
                    Identity:req.session.Identity,
                    Address:req.session.Address,
                    Pid : req.session.Pid.substring(0,4) + '****' + req.session.Pid.charAt(req.session.Pid.length -2) + req.session.Pid.charAt(req.session.Pid.length -1)
                }
                res.render('medicalrecord_form', { title: '填寫電子病歷', pdata: personalData, clinics: results.clinics, investigations:results.investigations, Identity:personalData.Identity, IsAdmin:req.session.IsAdmin, errors: errors.array() });
            });
            return;
        }
        else {
                var userData;
                blkchainMapping.save(function(err){
                    if(err){
                        console.log('Saving blockchainMapping table has errors:' + err);
                        return ; 
                    }
                    User.find({
                            $and:[
                                {Acct:req.body.username},
                                {Pwd:req.body.password},
                                {Identity:req.body.identity}
                            ]
                        },function(err, result){
                            userData = result;
                    });
                });

               var mRecord = {
                        ID: rId,
                        PID:"",
                        ClinicID: req.body.clinic,
                        Clinic:req.body.clinicname,
                        JobType: req.session.JobType,
                        Name: req.session.Name,
                        Birth: req.session.Birth,
                        Sex: req.session.Sex,
                        Btp: req.session.Btp,
                        Address: req.session.Address,
                        Email: req.session.Email,
                        Phone: req.session.Phone,
                        Identity:req.session.Identity,
                        CDvin: req.body.divisionname,
                        CDVinID: req.body.division,
                        Doctor: req.body.doctorname,
                        DoctorId:req.body.doctor,
                        Description: req.body.description,
                        Options:[] as Array<OptionModel>,
                        DoctorComment: [],
                        ConsultationDate: req.body.consultation_date
                } as MedicalRecord;
                 var optionModel1 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 mRecord.PID = req.session.Pid;
                 
                 optionModel1.Key = "OP1";
                 optionModel1.Description = 'Smoke';
                 optionModel1.Value =  req.body.OP1;
                 optionModel1.Comment = req.body.OP1_Comment && req.body.OP1_Comment != '' ?  req.body.OP1_Comment : "";
                 mRecord.Options.push(optionModel1);

                 var optionModel2 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel2.Key = "OP2";
                 optionModel2.Description = 'Drink';
                 optionModel2.Value =  req.body.OP2;
                 optionModel2.Comment = req.body.OP2_Comment && req.body.OP2_Comment != '' ?  req.body.OP2_Comment : "";
                 mRecord.Options.push(optionModel2);

                 var optionModel3 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel3.Key = "OP3";
                 optionModel3.Description = 'BeteNut';
                 optionModel3.Value =  req.body.OP3;
                 optionModel3.Comment = req.body.OP3_Comment && req.body.OP3_Comment != '' ?  req.body.OP3_Comment : "";
                 mRecord.Options.push(optionModel3);

                 var optionModel4 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel4.Key = "OP4";
                 optionModel4.Description = 'PotentialDise';
                 optionModel4.Value =  req.body.OP4;
                 optionModel4.Comment = req.body.OP4_Comment && req.body.OP4_Comment != '' ?  req.body.OP4_Comment : "";
                 mRecord.Options.push(optionModel4);

                var optionModel5 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel5.Key = "OP5";
                 optionModel5.Description = 'Surgery';
                 optionModel5.Value =  req.body.OP5;
                 optionModel5.Comment = req.body.OP5_Comment && req.body.OP5_Comment != '' ?  req.body.OP5_Comment : "";
                 mRecord.Options.push(optionModel5);

                var optionModel6 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel6.Key = "OP6";
                 optionModel6.Description = 'OTC';
                 optionModel6.Value =  req.body.OP6;
                 optionModel6.Comment = req.body.OP6_Comment && req.body.OP6_Comment != '' ?  req.body.OP6_Comment : "";
                 mRecord.Options.push(optionModel6);

                 var optionModel7 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel7.Key = "OP7";
                 optionModel7.Description = 'DrugSensitive';
                 optionModel7.Value =  req.body.OP7;
                 optionModel7.Comment = req.body.OP7_Comment && req.body.OP7_Comment != '' ?  req.body.OP7_Comment : "";
                 mRecord.Options.push(optionModel7);

                var optionModel8 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel8.Key = "OP8";
                 optionModel8.Description = 'SleepSituation';
                 optionModel8.Value =  req.body.OP8;
                 optionModel8.Comment = req.body.OP8_Comment && req.body.OP8_Comment != '' ?  req.body.OP8_Comment : "";
                 mRecord.Options.push(optionModel8);

                var optionModel9 = {Key:"", Description:"",Value:"",Comment:""} as OptionModel;
                 optionModel9.Key = "OP9";
                 optionModel9.Description = 'Travel';
                 optionModel9.Value =  req.body.OP9;
                 optionModel9.Comment = req.body.OP9_Comment && req.body.OP9_Comment != '' ?  req.body.OP9_Comment : "";
                 mRecord.Options.push(optionModel9);
                 
                 console.log("準備要建立的資料");
                 console.log(JSON.stringify(mRecord,null,4));
                 
                var client = await newGrpcConnection();

                var gateway = connect({
                    client,
                    identity: await newIdentity(),
                    signer: await newSigner(),
                    // Default timeouts for different gRPC calls
                    evaluateOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    endorseOptions: () => {
                        return { deadline: Date.now() + 15000 }; // 15 seconds
                    },
                    submitOptions: () => {
                        return { deadline: Date.now() + 5000 }; // 5 seconds
                    },
                    commitStatusOptions: () => {
                        return { deadline: Date.now() + 60000 }; // 1 minute
                    },
                });
                 var network = gateway.getNetwork(channelName);
                 var contract = network.getContract(chaincodeName);
                 await UploadMedicalRecord(contract, mRecord);
                 gateway.close();
                 client.close();
                 res.redirect('/info?text=新增成功!');
        }
    }
]); 

        // POST request to delete medicalrecord.
        // 1. delete data from  common db's blockchainMapping table
        // 2. Delete data from blockchain network
        app.post('/medicalrecord/delete', function(req,res,next){

            var recordId = req.body.deletingId;
            console.log("要被刪掉的id");
            console.log(recordId);
            blockChainMapping.deleteOne({RecordID:recordId}, async function(err){
                if(err){
                    console.log("Deleting record from blockchainMapping table has errors: " + err);
                    return;
                }
                else
                {
                    console.log("Deletion of blockchainMapping succeeds. Start deleting data in blockchain......");

                    var client = await newGrpcConnection();
                    var gateway = connect({
                        client,
                        identity: await newIdentity(),
                        signer: await newSigner(),
                        // Default timeouts for different gRPC calls
                        evaluateOptions: () => {
                            return { deadline: Date.now() + 5000 }; // 5 seconds
                        },
                        endorseOptions: () => {
                            return { deadline: Date.now() + 15000 }; // 15 seconds
                        },
                        submitOptions: () => {
                            return { deadline: Date.now() + 5000 }; // 5 seconds
                        },
                        commitStatusOptions: () => {
                            return { deadline: Date.now() + 60000 }; // 1 minute
                        },
                    });
                    var network = gateway.getNetwork(channelName);
                    var contract = network.getContract(chaincodeName);
                    await DeleteExistentMedicalRecord(contract, recordId);
                    gateway.close();
                    client.close();
                    res.redirect('/info?text=刪除成功!');
                }

            });
        });




        app.get('/catalog/appointment', function(req, res, next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            res.render('health_reports', { title: '預約看診', error: null, data:null  });
        }); 


        app.get('/info', function(req,res,next){
            if (!req.session.loggedin) {
                res.redirect('/login');
            }
            var resultText = "";
                resultText = req.query.text;
            res.render('custom',{text:resultText});
        });

        app.post('/catalog/uploadData', function(req, res, next){
            var obj = {InExecution:req.body.InExecution};
            var db_url = "mongodb+srv://wei:blockchain@cluster0.swy8m5a.mongodb.net/{DataBase}?retryWrites=true&w=majority";
            var db_name = "";
            if(req.session.HID != null && req.session.HID.startsWith("A")){
                db_name = "MedicalDB";
                db_url = db_url.replace("{DataBase}", db_name);
            }
            else if(req.session.HID != null && req.session.HID.startsWith("B")){
                db_name = "MedicalDB2";
                db_url = db_url.replace("{DataBase}", db_name);
            }
            const client2 = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
            client2.connect(err => {
              const collection = client2.db(db_name).collection("MedicalRecord");
               collection
               .aggregate([
                    {$lookup:{ from: 'Hospital', localField: 'ClinicID', foreignField:'Hid', as:'HospitalInfo' }},
                    {"$unwind": "$HospitalInfo"}
                ]).toArray().then(res => {
                    console.log("查詢結果");
                    console.log(res);
                }).catch(err => {
                        console.log(err);
                        next(err);
                    }).finally(() =>{
                        client2.close();
                        /*
                            upload to blockchain
                        */
                        obj.InExecution = 'false';
                        res.send(JSON.stringify(obj));
                    })
                });
            });

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
          next(createError(404));
        });

        // error handler
        app.use(function(err, req, res, next) {
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = req.app.get('env') === 'development' ? err : {};

          // render the error page
          res.status(err.status || 500);
          res.render('error');
        });

        /*var port = Math.random() * (3010 - 3000) + 3000;
        do
        {
            port = Math.round(port);
        }
        while(port == 3000);*/
        var port = config.app.Port;
        app.listen(port, () => {
          console.log(`[server]: Server is running at https://localhost:${port}`);
        });
        module.exports = app;
    } finally {

    }
}

main().catch(error => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});



/*async function uploadMedData(contract:Contract, mRecord:MedicalRecord) {
     
    console.log("要新增的資料");
    console.log(mRecord);
    await UploadMedicalRecord(contract);
}*/

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of MedicalRecords on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function GetAllMedicalRecords(contract: Contract) : Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllMedicalRecords, function returns all the current MedicalRecords on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllMedicalRecords');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function UploadMedicalRecord(contract: Contract, mRecord:any): Promise<void> {

    await contract.submitTransaction('UploadMedicalRecord', JSON.stringify(mRecord));

    console.log('*** Transaction committed successfully');
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */


async function ReadMedicalRecordByID(contract: Contract, id:string): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadMedicalRecord, function returns MedicalRecord attributes');
    const resultBytes = await contract.evaluateTransaction('ReadMedicalRecord', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    //console.log('*** Result:', result);
    return result;
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract if update's error occurs
 */
async function UpdateExistentMedicalRecord(contract: Contract, mRecord:any): Promise<void>{
    console.log('\n--> Submit Transaction: UpdateMedicalRecord ');

    try {
        const resultBytes = await contract.submitTransaction("UpdateMedicalRecord", JSON.stringify(mRecord));
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;
        //console.log('******** FAILED to return an error');

    } catch (error) {
        console.log('*** Successfully caught the error: \n', error);
        throw error;
    }
}

async function DeleteExistentMedicalRecord(contract:Contract, id:string):Promise<void>{
    console.log('\n--> Submit Transaction: DeleteMedicalRecord ');
    try{

        const resultBytes = await contract.submitTransaction("DeleteMedicalRecord", id);
        const resultJson = utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;

    } catch(error){
        console.log('*** DeleteMedicalRecord has errors: \n', error);
        throw error;
    }
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certPath:          ${certPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}