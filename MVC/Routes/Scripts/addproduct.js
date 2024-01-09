const con=require("../../../models/database");

con.connect(function(error){
    if(error) console.log(error);
    else{
        console.log("SQL started");
    }
  });
const queryAsync = (sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql ,(err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  con.connect(function(error){
    if(error) console.log(error);
    else{
        console.log("SQL started");
    }
  });
  for(i=0;i<100;i++)
  {
    try{
        let query=`insert INTO products (product,des,prid,filename,price,quantity,sellerid,approved,status) values ("product${i}","Description${i}",${i},"1234",${i},10,0.7920820104260347,1,"approved")`;
        queryAsync(query);
    }catch(error)
    {
        console.log(error);
    }
  }