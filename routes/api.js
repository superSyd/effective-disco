'use strict';
const mongoose = require('mongoose')

mongoose.connect(process.env.DB, {
  useNewURLParser: true, 
  useUnifiedTopology: true
});

if(!mongoose.connection.readyState){
  console.log("database error")
}

module.exports = function (app) {

  const issueSchema = new mongoose.Schema({
    project: {
      type: String,
      required: true
      },
    issue_title: {
      type: String,
      required: true
      },
    issue_text: {
      type: String,
      required: true
      },
    created_on: {
      type: String,
      required: true        
      },
    updated_on: {
      type: String,
      required: true
      },
    created_by: {
      type: String,
      required: true
      },
    assigned_to: {
      type: String
      },
    open: {
      type: Boolean,
      required: true
      },
    status_text: {
      type: String
      }
    
  })

  let Issue = mongoose.model("issue", issueSchema); 

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let _id = req.query._id;
      let issue_title = req.query.issue_title;
      let issue_text = req.query.issue_text;
      let created_on = req.query.created_on;
      let updated_on = req.query.updated_on;
      let created_by = req.query.created_by;
      let assigned_to = req.query.assigned_to;
      let open = req.query.open;
      let status_text = req.query.status_text;

      if(project){

        const filter = {};

        filter.project = project

        if(_id){
          filter._id = _id
        }
        if(issue_title){
          filter.issue_title = issue_title
        }
        if(issue_text){
          filter.issue_text = issue_text
        }
        if(created_on){
          filter.created_on = created_on
        }
        if(updated_on){
          filter.updated_on = updated_on
        }
        if(created_by){
          filter.created_by = created_by
        }
        if(assigned_to){
          filter.assigned_to = assigned_to
        }

        if(open != undefined){
          filter.open = open

        }

        if(status_text){
          filter.status_text = status_text
        }


        console.log(filter)
        Issue.find(filter,(err,issues)=>{
          
          if(err){
            return res.json({
            "error": err
            })
          }

          var issueObject = issues.map(issue =>{
            
              return { 
            "_id": issue._id,
            "issue_title": issue.issue_title,
            "issue_text": issue.issue_text,
            "created_on": issue.created_on,
            "updated_on": issue.updated_on,
            "created_by": issue.created_by,
            "assigned_to": issue.assigned_to,
            "open": issue.open,
            "status_text": issue.status_text
              }

            
      
            })

            return res.json(issueObject)

          })

      } else {

        return res.send('Please enter project name')

      }

      

      
    })
    
    .post(function (req, res){
      
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_on = new Date().toISOString();
      let updated_on = created_on;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to ? req.body.assigned_to : "" ;
      let open = true;
      let status_text = req.body.status_text ? req.body.status_text : "";


      if(project){
        if(!issue_title || !issue_text || !created_by){
          
          return res.json({
            error: 'required field(s) missing'
          })
          
        } else {

          const myIssue = new Issue({
        project: project,
        issue_title: issue_title, 
        issue_text: issue_text, 
        created_on: created_on, 
        updated_on: updated_on, 
        created_by: created_by, 
        assigned_to: assigned_to, 
        open: open, 
        status_text: status_text
        });


        myIssue.save((err,issue)=>{
        if(err || issue === null){
            return res.json({
            "error": err
            })
          }
          
          return res.json({
            "_id": issue._id,
            "issue_title": issue.issue_title,
            "issue_text": issue.issue_text,
            "created_on": issue.created_on,
            "updated_on": issue.updated_on,
            "created_by": issue.created_by,
            "assigned_to": issue.assigned_to,
            "open": issue.open,
            "status_text": issue.status_text
              
          })
        })

        }
        
      } else {
        return res.send('Please enter project name')
      }

      
      
    })
    
    .put(function (req, res){

          console.log(req.url)


      let project = req.params.project;
      let _id = req.body._id;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let open = req.body.status_text;
      let status_text = req.body.status_text;

      console.log(project,_id,issue_title,issue_text,created_by,assigned_to,open,status_text)

      const updateFields = {};

        
        if(issue_title){
          updateFields.issue_title = issue_title
        }
        if(issue_text){
          updateFields.issue_text = issue_text
        }
        
        if(created_by){
          updateFields.created_by = created_by
        }
        if(assigned_to){
          updateFields.assigned_to = assigned_to
        }

        if(status_text){
          updateFields.status_text = status_text
        }


      if(project){
        if(_id == undefined || _id == ""){
          
        return res.json({
            error: 'missing _id'
          })

        } else {

          if(Object.keys(updateFields).length>0){

            Issue.findById(_id,(err,dataIssue)=>{

            if(err || dataIssue === null){
              return res.json({ 
                  error: 'could not update', 
                  '_id': _id })
            } else 

            if(dataIssue != null){

              if(updateFields.issue_title){
                dataIssue.issue_title = updateFields.issue_title;

              }

              if(updateFields.issue_text){
                dataIssue.issue_text = updateFields.issue_text; 

              }

              if(updateFields.created_by){
                dataIssue.created_by = updateFields.created_by; 

              }

              if(updateFields.assigned_to){
                dataIssue.assigned_to = updateFields.assigned_to; 
              }

              if(updateFields.open){
                dataIssue.open = updateFields.open;

              }

              if(updateFields.status_text){
                dataIssue.status_text = updateFields.status_text;

              }

              dataIssue.updated_on = new Date().toISOString();

               
              
              dataIssue.save((err,issue)=>{
              if(err || issue === null){
                return res.json({ 
                  error: 'could not update', 
                  '_id': _id })
              } else {
          
                return res.json({  result: 'successfully updated', '_id': _id })

              }

              

              })
            }
            
            })
          } else {
            return res.json({ 
            error: 'no update field(s) sent', 
            '_id': _id })

          }
         

      }
        
      }else {
        return res.send('Please enter project name')
      }

    })
    
    .delete(function (req, res){

      let project = req.params.project;
      let _id = req.body._id;


      if(project){
        if(!_id){
          return res.json({ error: 'missing _id' })

        } else{

          Issue.findByIdAndRemove(_id, (err,issue)=>{
            if(err || issue === null){
              return res.json({ 
                error: 'could not delete', 
                '_id': _id })
            } else {
              return res.json({ 
              result: 'successfully deleted', 
              '_id': _id })

            }

            
          })

        }

      } else {
        return res.send('Please enter project name')

      }


      
    });
    
};
