using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestMakerFreeWebApp.ViewModels;
using Newtonsoft.Json;
using TestMakerFreeWebApp.Data;
using Mapster;
using Microsoft.Azure.KeyVault.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestMakerFreeWebApp.Controllers
{
    [Route("api/[controller]")]
    public class QuizController : BaseApiController
    {
        #region Constructor
        public QuizController (ApplicationDbContext context) : base(context) { }
        #endregion

        #region RESTful conventions methods
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var quiz = DbContext.Quizzes.Where(i => i.Id == id).FirstOrDefault();

            if(quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz Id = {0} has not been found", id)
                });
            }

            return new JsonResult(
                quiz.Adapt<QuizViewModel>(),
                JsonSettings);
        }
        [HttpPut]
        public IActionResult Put([FromBody]QuizViewModel model)
        {
            if(model == null)
            {
                return new StatusCodeResult(500);
            }
            var quiz = model.Adapt<Quiz>();
            quiz.CreatedDate = DateTime.Now;
            quiz.LastModifiedDate = DateTime.Now;
            quiz.UserId = DbContext.Users.Where(u => u.UserName == "Admin").FirstOrDefault().Id;

            DbContext.Quizzes.Add(quiz);
            DbContext.SaveChanges();

            return new JsonResult(
                quiz.Adapt<QuizViewModel>(),
                JsonSettings);

        }
        [HttpPost]
        public IActionResult Post([FromBody]QuizViewModel model)
        {
            if(model == null)
            {
                return new StatusCodeResult(500);
            }
            var quiz = DbContext.Quizzes.Where(q => q.Id == model.Id).FirstOrDefault();
            if(quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz with Id = {0} has not been found", model.Id)
                });
            }

            quiz.Title = model.Title;
            quiz.Description = model.Description;
            quiz.Text = model.Text;
            quiz.Notes = model.Notes;
            quiz.LastModifiedDate = DateTime.Now;

            DbContext.SaveChanges();

            return new JsonResult(
                quiz.Adapt<QuizViewModel>(),
                JsonSettings);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var quiz = DbContext.Quizzes.Where(q => q.Id == id).FirstOrDefault();
            if(quiz == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Quiz with Id = {0} has not been found", id)
                });
            }
            DbContext.Quizzes.Remove(quiz);
            DbContext.SaveChanges();

            return new OkResult();
        }
        #endregion

        #region Publick methods
        [HttpGet("Latest/{num:int?}")]
        public IActionResult Latest(int num = 10)
        {
            var latest = DbContext.Quizzes
                .OrderByDescending(q => q.CreatedDate)
                .Take(num)
                .ToArray();

            return new JsonResult(
                latest.Adapt<QuizViewModel[]>(),
                JsonSettings);
        }

        [HttpGet("ByTitle/{num:int?}")]
        public IActionResult ByTitle(int num = 10)
        {
            var sampleQuizzes = DbContext.Quizzes
                .OrderBy(q => q.Title)
                .Take(num)
                .ToArray();

            return new JsonResult(
                sampleQuizzes.Adapt<QuizViewModel[]>(),
                JsonSettings);
        }

        [HttpGet("Random/{num:int?}")]
        public IActionResult Random(int num = 10)
        {
            var quizzes = DbContext.Quizzes
                .OrderBy(q => Guid.NewGuid())
                .Take(num)
                .ToArray();

            return new JsonResult(
                quizzes.Adapt<QuizViewModel[]>(),
                JsonSettings);
        }
        #endregion
    }
}
