const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var firstId, secondId;
  
  suite("Create Tests", function () {
    //Create an issue with every field: POST request to /api/issues/{project}
    test("Create an issue with every field: POST request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .post("/api/issues/api-project")
        .send({
        issue_title: "First Issue Title", 
        issue_text: "First Issue Text",  
        created_by: "First Created By", 
        assigned_to: "First Assigned To",
        status_text: "First Status Text"
        })
        .end(function (err, res) {

          firstId = res.body._id;
          
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'First Issue Title');
          assert.equal(res.body.issue_text, 'First Issue Text');
          assert.equal(res.body.created_by, 'First Created By');
          assert.equal(res.body.assigned_to, 'First Assigned To');
          assert.equal(res.body.open, true);
          assert.equal(res.body.status_text, 'First Status Text');


          done();
        });
    });

    //Create an issue with only required fields: POST request to /api/issues/api-project
    test("Create an issue with only required fields: POST request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .post("/api/issues/api-project")
        .send({
          issue_title: "Second Issue Title", 
          issue_text: "Second Issue Text",  
          created_by: "Second Created By"
        })
        .end(function (err, res) {
          secondId = res.body._id;
          
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Second Issue Title');
          assert.equal(res.body.issue_text, 'Second Issue Text');
          assert.equal(res.body.created_by, 'Second Created By');
          assert.equal(res.body.open, true);


          done();
        });
    });

    //Create an issue with missing required fields: POST request to /api/issues/api-project
    test("Create an issue with missing required fields: POST request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .post("/api/issues/api-project")
        .send({

        })
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');


          done();
        });
    });

    





  })
  
  suite("View Tests", function () {
    
    //View issues on a project: GET request to /api/issues/api-project
    test("View issues on a project: GET request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .get("/api/issues/api-project")
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.isArray(res.text.split(","));

          done();
        });
    });
    //View issues on a project with one filter: GET request to /api/issues/api-project
    test("View issues on a project with one filter: GET request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .get("/api/issues/api-project?open=true")
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.isArray(JSON.parse(res.text));


          done();
        });
    });

    //View issues on a project with multiple filters: GET request to /api/issues/api-project
    test("View issues on a project with multiple filters: GET request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .get("/api/issues/api-project?open=true&assigned_to=First Assigned To")
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.isArray(JSON.parse(res.text));


          done();
        });
    });
  })
  
  suite("Update Tests", function () {
    //Update one field on an issue: PUT request to /api/issues/api-project
    test("Update one field on an issue: PUT request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .put("/api/issues/api-project")
        .send({
          _id: firstId,
          issue_title: "New First Issue Title"
        })
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.result,'successfully updated')
          assert.equal(res.body._id, firstId)


          done();
        });
    });
    //Update multiple fields on an issue: PUT request to /api/issues/api-project
    test("Update multiple fields on an issue: PUT request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .put("/api/issues/api-project")
        .send({
          _id: firstId,
          issue_text: "New First Issue Text",
          created_by: "New First Created By",
          assigned_to: "New First Assigned To"
        })
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.result,'successfully updated')
          assert.equal(res.body._id, firstId)


          done();
        });
    });
    //Update an issue with missing _id: PUT request to /api/issues/api-project
    test("Update an issue with missing _id: PUT request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .put("/api/issues/api-project")
        .send({
        })
        .end(function (err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'missing _id')


          done();
        });
    });
    //Update an issue with no fields to update: PUT request to /api/issues/api-project
    test("Update an issue with no fields to update: PUT request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .put("/api/issues/api-project")
        .send({
          _id: firstId
        })
        .end(function (err, res) {

          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'no update field(s) sent')
          assert.equal(res.body._id,firstId)


          done();
        });
    });
    //Update an issue with an invalid _id: PUT request to /api/issues/api-project
    test("Update an issue with an invalid _id: PUT request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .put("/api/issues/api-project")
        .send({
          _id: firstId +""+secondId,
          issue_text: "New First Issue Text with Invalid Id",
        })
        .end(function (err, res) {
                    
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'could not update')
          assert.equal(res.body._id,firstId +""+secondId)


          done();
        });
    });

    })
  
  suite("Delete Tests", function () {
    //Delete an issue: DELETE request to /api/issues/api-project
    test("Delete an issue: DELETE request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .delete("/api/issues/api-project")
        .send({
          _id: secondId
        })
        .end(function (err, res) {
                    
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.result,'successfully deleted')
          assert.equal(res.body._id,secondId)


          done();
        });
    });
    //Delete an issue with an invalid _id: DELETE request to /api/issues/api-project
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .delete("/api/issues/api-project")
        .send({
          _id: firstId+""+secondId,
        })
        .end(function (err, res) {
                    
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'could not delete')
          assert.equal(res.body._id,firstId+""+secondId)


          done();
        });
    });
    //Delete an issue with missing _id: DELETE request to /api/issues/api-project
    test("Delete an issue with missing _id: DELETE request to /api/issues/api-project", function (done) {
      chai
        .request(server)
        .delete("/api/issues/api-project")
        .send({
        })
        .end(function (err, res) {
                    
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error,'missing _id')


          done();
        });
    });
    
    })


  
});
