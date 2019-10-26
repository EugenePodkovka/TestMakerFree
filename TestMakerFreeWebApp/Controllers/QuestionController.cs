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
    public class QuestionController : BaseApiController
    {
        #region Constructors
        public QuestionController(ApplicationDbContext context) : base(context) { }
        #endregion

        #region RESTfull conventions methods
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var question = DbContext.Questions.Where(q => q.Id == id).FirstOrDefault();
            if (question == null)
            {
                return NotFound(new
                {
                    Exception = String.Format("Question with Id={0} has not been found.", id)
                });
            }
            return new JsonResult(
                question.Adapt<QuestionViewModel>(),
                JsonSettings);
        }
        [HttpPut]
        public IActionResult Put([FromBody]QuestionViewModel model)
        {
            if(model == null)
            {
                return new StatusCodeResult(500);
            }
            var question = model.Adapt<Question>();
            question.CreatedDate = DateTime.Now;
            question.LastModifiedDate = DateTime.Now;

            DbContext.Questions.Add(question);
            DbContext.SaveChanges();

            return new JsonResult(
                question.Adapt<QuestionViewModel>(),
                JsonSettings);
        }
        [HttpPost]
        public IActionResult Post([FromBody]QuestionViewModel model)
        {
            if (model == null)
            {
                return new StatusCodeResult(500);
            }
            var question = DbContext.Questions.Where(q => q.Id == model.Id).FirstOrDefault();
            if (question == null)
            {
                NotFound(new
                {
                    Exception = String.Format("Question with Id={0} has not been found.", model.Id)
                });
            }
            question.QuizId = model.QuizId;
            question.Text = model.Text;
            question.Notes = model.Notes;
            question.Type = model.Type;
            question.Flags = model.Flags;
            question.LastModifiedDate = model.LastModifiedDate == null ? DateTime.Now : model.LastModifiedDate;

            DbContext.SaveChanges();

            return new JsonResult(
                question.Adapt<QuestionViewModel>(),
                JsonSettings);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var question = DbContext.Questions.Where(q => q.Id == id).FirstOrDefault();
            if(question == null)
            {
                return NotFound(new
                {
                    Exception = String.Format("Question with Id={0} has not been found.", id)
                });
            }
            DbContext.Questions.Remove(question);
            DbContext.SaveChanges();
            return new OkResult();
        }
        #endregion

        [HttpGet("All/{quizId}")]
        public IActionResult All(int quizId)
        {
            var questions = DbContext.Questions.Where(q => q.QuizId == quizId).ToArray();

            return new JsonResult(
                questions.Adapt<QuestionViewModel[]>(),
                JsonSettings);
        }

    }
}
