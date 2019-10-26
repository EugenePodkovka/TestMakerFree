using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestMakerFreeWebApp.ViewModels;
using Newtonsoft.Json;
using TestMakerFreeWebApp.Data;
using Mapster;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestMakerFreeWebApp.Controllers
{
    [Route("api/[controller]")]
    public class AnswerController : BaseApiController
    {
        #region Costructors
        public AnswerController(ApplicationDbContext context) : base(context) { }
        #endregion

        #region RESTful conventions methods
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var answer = DbContext.Answers.Where(a => a.Id == id).FirstOrDefault();
            if(answer == null)
            {
                return NotFound(new
                {
                    Exception = String.Format("Answer with Id={0} has not been found.", id)
                });
            }
            return new JsonResult(
                answer.Adapt<AnswerViewModel>(),
                JsonSettings);
        }
        [HttpPut]
        public IActionResult Put([FromBody]AnswerViewModel model)
        {
            if(model == null)
            {
                return new StatusCodeResult(500);
            }
            var answer = model.Adapt<Answer>();
            answer.CreatedDate = DateTime.Now;
            answer.LastModifiedDate = DateTime.Now;
            DbContext.Answers.Add(answer);
            DbContext.SaveChanges();
            return new JsonResult(
                answer.Adapt<AnswerViewModel>(),
                JsonSettings);
        }
        [HttpPost]
        public IActionResult Post([FromBody]AnswerViewModel model)
        {
            if(model == null)
            {
                return new StatusCodeResult(500);
            }
            var answer = DbContext.Answers.Where(a => a.Id == model.Id).FirstOrDefault();
            if(answer == null)
            {
                return NotFound(new
                {
                    Exception = String.Format("Answer with Id={0} has not been found.", model.Id)
                });
            }
            answer.QuestionId = model.QuestionId;
            answer.Text = model.Text;
            answer.Value = model.Value;
            answer.Notes = model.Notes;
            answer.Type = model.Type;
            answer.Flags = model.Flags;
            answer.LastModifiedDate = model.LastModifiedDate == null ? DateTime.Now : model.LastModifiedDate;

            DbContext.SaveChanges();

            return new JsonResult(
                answer.Adapt<AnswerViewModel>(),
                JsonSettings);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var answer = DbContext.Answers.Where(a => a.Id == id).FirstOrDefault();
            if(answer == null)
            {
                return NotFound(new
                {
                    Exception = String.Format("Answer with Id={0} has not been found.", id)
                });
            }
            DbContext.Answers.Remove(answer);
            DbContext.SaveChanges();
            return new OkResult();
        }
        #endregion

        #region Public Methods
        [HttpGet("All/{questionId}")]
        public IActionResult All(int questionId)
        {
            var answers = DbContext.Answers.Where(a => a.QuestionId == questionId).ToArray();
            return new JsonResult(
                answers.Adapt<AnswerViewModel[]>(),
                JsonSettings);
        }
        #endregion
    }
}
