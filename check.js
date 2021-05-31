import mailchimp from "@mailchimp/mailchimp_marketing";
import xlsx from "xlsx";
import axios from "axios";
import md5 from 'md5'
import { response } from "express";
import ObjectsToCsv from 'objects-to-csv';


mailchimp.setConfig({
  apiKey: "Your API KEY",
  server: "Server Prefix",
  });
  const listId = "Your LIST ID";
   var offset = 0;
  const count = 1000;
  var totalItems = 0;
  var array1 = [];

const run = async () => {
  const response = await mailchimp.lists.getListMembersInfo(listId, {
    count,
    offset,
    fields: ['members.email_address','members.merge_fields.PHONE','total_items']
  });
  
  totalItems = response.total_items;
  response.members.map((elem) =>{
    array1.push({email: elem.email_address, phone: elem.merge_fields.PHONE})
  })

  for(var i=1; i<totalItems/count; i++)
  {
        offset=offset+1000;
        console.log(offset);
        const response = await mailchimp.lists.getListMembersInfo(listId, {
        count,
        offset,
        fields: ['members.email_address','members.merge_fields.PHONE','total_items']
      });
      response.members.map((elem) =>
      {
        array1.push({email: elem.email_address, phone: elem.merge_fields.PHONE})
      })
       
  };
  console.log(array1, "This_Is_Array_Data");

    const csv = new ObjectsToCsv(array1);
    await csv.toDisk('check.csv');
};
run();





