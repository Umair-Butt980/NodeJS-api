import mailchimp from "@mailchimp/mailchimp_marketing";
import xlsx from "xlsx";
import md5 from 'md5'

// For reading the excel file.
var workBook = xlsx.readFile("tripdata.xlsx");
var workSheet = workBook.Sheets["list"];
var data = xlsx.utils.sheet_to_json(workSheet);


var myUsers = [];

mailchimp.setConfig({
apiKey: "Your key",
server: "Server prefix",
});
const listId = " Your list ID";

async function run(user) {
    console.log(user, "Check-User")
     myUsers.push({
            EMAIL:                              user.email,
            status: "subscribed",
            merge_fields:{
                RECENTBOOK:                      user.RecentBookingFleet,
                RECENTDISP:                      user.RecentDispatchFleet,
                RECENTPICK:                      user.RecentPickUpSuburb,
                RECENTCITY:                      user.RecentCity,
                RECENTSTAT:                      user.RecentState,
                CHANNELSUS:                      user.channels_used_last365,
                APPUSED:                         user.applications_used_last365,
                DISTINCT:                        user.distinct_bookings_last365,
                RECENTREQ:                       user.RecentRequestedDate,
                BOOKCHANNE:                      user.RecentBookingChannel,
                BOOKSOURCE:                      user.RecentBookingSource_Application_Name,
                FLEETNAME:                       user.BccFleetName,
                SYSTEMID:                        user.DispatchSystemID,
                FLEETID:                         user.DispatchFleetID,
                FREBOOK:                         user.FrequentBookingChannel,
                FREAPP:                          user.FrequentBookingApplication,
                FREEBOOK:                        user.FrequencyBookings
            }
          
        }); 
}
data.forEach(async user => 
    {  
        run(user)
    });
    console.log(myUsers, "This is the other data");


    const operations = myUsers.map((user, i) => ({
        method: "PUT",
        path: '/lists/'+listId+'/members/'+md5((user.EMAIL).toLowerCase()),
        body: JSON.stringify(user)
        }));

    
        const response = await mailchimp.batches.start({
        operations
        });
        console.log(response);
