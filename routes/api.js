'use strict';

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
      let id = req.body._id;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_on = req.body.created_on;
      let updated_on = req.body.updated_on;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let open = req.body.open;
      let status_text = req.body.status_text;

      var issueList = {}

     


      if(project){
        Issue.find({project: project, _id: id, issue_title: issue_title, issue_text: issue_text, created_on: created_on, updated_on: updated_on, created_by: created_by, assigned_to: assigned_to, open: open, status_text: status_text},(err,issues)=>{
          
          if(err){
            return res.json({
            "error": err
            })
          }

          var issueObject = issues.map(issues =>{
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
        if(!issue_title){
          return res.send('Please enter issue title')

        } else if(!issue_text){
          return res.send('Please enter issue text')

        } else if(!created_by){
          return res.send('Please enter creator')
          
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
        if(err){
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
      let project = req.params.project;
      let id = req.body._id;
      let issue_title = req.body.issue_title ? req.body.issue_title : "";
      let issue_text = req.body.issue_text ? req.body.issue_text : "";
      let updated_on = new Date().toISOString();
      let created_by = req.body.created_by ?  req.body.created_by : "";
      let assigned_to = req.body.assigned_to ? req.body.assigned_to : "" ;
      let open = req.body.status_text;
      let status_text = req.body.status_text ? req.body.status_text : "";


      if(project){
        if(!id){
        return res.send('Please enter id')
        } else {

          Issue.findById(id,(err,data)=>{

            if(err){
              return res.json({
              "error": err
              })
            }

            data.project = project;
            data.issue_title = issue_title;
            data.issue_text = issue_text; 
            data.created_on = created_on; 
            data.updated_on = updated_on; 
            data.created_by = created_by; 
            data.assigned_to = assigned_to; 
            data.open = open; 
            data.status_text = status_text;

            data.save((err,issue)=>{
            if(err){
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
        
        })

          

      }
        
      }else {
        return res.send('Please enter project name')
      }

    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let id = req.body._id;

      if(project){
        if(id){
          Issue.findByIdAndRemove(id, (err,issue)=>{
            if(err){
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


        } else{
          return res.send('Please enter id')

        }

      } else {
        return res.send('Please enter project name')

      }


      
    });
    
};
