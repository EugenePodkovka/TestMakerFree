using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TestMakerFreeWebApp.ViewModels;
using TestMakerFreeWebApp.Data;
using Mapster;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestMakerFreeWebApp.Controllers
{
    [Route("api/[controller]")]
    public class ResultController : BaseApiController
    {
        #region Constructors
        public ResultController(ApplicationDbContext context) : base(context) { }
        #endregion

        #region RESTful conventions methods
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var result = DbContext.Results.Where(i => i.Id == id)
                .FirstOrDefault();

            // handle requests asking for non-existing results
            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", id)
                });
            }

            return new JsonResult(
                result.Adapt<ResultViewModel>(),
                JsonSettings);
        }

        [HttpPut]
        public IActionResult Put([FromBody]ResultViewModel model)
        {
            if (model == null) return new StatusCodeResult(500);
            var result = model.Adapt<Result>();
            result.CreatedDate = DateTime.Now;
            result.LastModifiedDate = result.CreatedDate;
            DbContext.Results.Add(result);
            DbContext.SaveChanges();
            return new JsonResult(result.Adapt<ResultViewModel>(),
                JsonSettings);
        }

        [HttpPost]
        public IActionResult Post([FromBody]ResultViewModel model)
        {
            if (model == null) return new StatusCodeResult(500);
            var result = DbContext.Results.Where(q => q.Id == model.Id).FirstOrDefault();

            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", model.Id)
                });
            }
            result.QuizId = model.QuizId;
            result.Text = model.Text;
            result.MinValue = model.MinValue;
            result.MaxValue = model.MaxValue;
            result.Notes = model.Notes;

            result.LastModifiedDate = result.CreatedDate;
            DbContext.SaveChanges();

            return new JsonResult(
                result.Adapt<ResultViewModel>(),
                JsonSettings);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = DbContext.Results.Where(i => i.Id == id)
                .FirstOrDefault();

            if (result == null)
            {
                return NotFound(new
                {
                    Error = String.Format("Result ID {0} has not been found", id)
                });
            }

            DbContext.Results.Remove(result);
            DbContext.SaveChanges();
            return new OkResult();
        }
        #endregion

        #region Public Methods
        [HttpGet("All/{quizId}")]
        public IActionResult All(int quizId)
        {
            var results = DbContext.Results
                .Where(q => q.QuizId == quizId)
                .ToArray();
            return new JsonResult(
                results.Adapt<ResultViewModel[]>(),
                JsonSettings);
        }
        #endregion
    }
}
