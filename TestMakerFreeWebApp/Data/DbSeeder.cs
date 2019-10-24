using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestMakerFreeWebApp.Data
{
    public class DbSeeder
    {
        #region Public Methods
        public static void Seed(ApplicationDbContext dbContext)
        {
            if (!dbContext.Users.Any())
            {
                CreateUsers(dbContext);
            }
            if (!dbContext.Quizzes.Any())
            {
                CreateQuizzes(dbContext);
            }
        }
        #endregion

        #region Seed Methods
        private static void CreateUsers(ApplicationDbContext dbContext)
        {
            DateTime createdDate = new DateTime(2016, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            var user_Admin = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "admin@test.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate

            };
            dbContext.Users.Add(user_Admin);

#if DEBUG
            var user_Ryan = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Ryan",
                Email = "ryan@test.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            var user_Solice = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Solice",
                Email = "Solice@test.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            var user_Vodan = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Vodan",
                Email = "Vodan@test.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            dbContext.Users.AddRange(user_Ryan, user_Solice, user_Vodan);
#endif
            dbContext.SaveChanges();
        }
        private static void CreateQuizzes(ApplicationDbContext dbContext)
        {
            DateTime createdDate = new DateTime(2016, 03, 01, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            var authorId = dbContext.Users
                .Where(u => u.UserName == "Admin")
                .FirstOrDefault()
                .Id;
#if DEBUG
            var num = 47;
            for(var i = 0; i <= num; i++)
            {
                CreateSampleQuiz(
                    dbContext,
                    i,
                    authorId,
                    num - 1,
                    3,
                    3,
                    3,
                    createdDate.AddDays(-num)
                    );     
            }
#endif
            EntityEntry<Quiz> e1 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "Quiz question 1",
                Description = "Quiz 1 description",
                Text = "quiz 1 text",
                ViewCount = 1000,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            EntityEntry<Quiz> e2 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "Quiz question 2",
                Description = "Quiz 2 description",
                Text = "quiz 2 text",
                ViewCount = 2000,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            EntityEntry<Quiz> e3 = dbContext.Quizzes.Add(new Quiz()
            {
                UserId = authorId,
                Title = "Quiz question 3",
                Description = "Quiz 3 description",
                Text = "quiz 3 text",
                ViewCount = 3000,
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            });
            dbContext.SaveChanges();
        }
        #endregion

        #region Utility Methods
        private static void CreateSampleQuiz(
            ApplicationDbContext dbContext,
            int num,
            string authorId,
            int viewCount,
            int numberOfQuestions,
            int numberOfAnswersPerQuestion,
            int numberOfResults,
            DateTime createdDate)
        {
            var quiz = new Quiz()
            {
                UserId = authorId,
                Title = String.Format("Quiz {0} Title", num),
                Description = String.Format("This is a sample description for quiz {0}.", num),
                Text = "This is a sample quiz created by the DbSeeder class for testing purposes. " +
                        "All the questions, answers & results are auto-generated as well.",
                ViewCount = viewCount,
                CreatedDate = createdDate,
                LastModifiedDate = createdDate
            };
            dbContext.Quizzes.Add(quiz);
            dbContext.SaveChanges();

            for (int i = 0; i < numberOfQuestions; i++)
            {
                var question = new Question()
                {
                    QuizId = quiz.Id,
                    Text = "This is a sample question created by the DbSeeder class for testing purposes. " +
                        "All the child answers are auto-generated as well.",
                    CreatedDate = createdDate,
                    LastModifiedDate = createdDate
                };
                dbContext.Questions.Add(question);
                dbContext.SaveChanges();

                for (int i2 = 0; i2 < numberOfAnswersPerQuestion; i2++)
                {
                    var e2 = dbContext.Answers.Add(new Answer()
                    {
                        QuestionId = question.Id,
                        Text = "This is a sample answer created by the DbSeeder class for testing purposes. ",
                        Value = i2,
                        CreatedDate = createdDate,
                        LastModifiedDate = createdDate
                    });
                }
            }

            for (int i = 0; i < numberOfResults; i++)
            {
                dbContext.Results.Add(new Result()
                {
                    QuizId = quiz.Id,
                    Text = "This is a sample result created by the DbSeeder class for testing purposes. ",
                    MinValue = 0,
                    // max value should be equal to answers number * max answer value
                    MaxValue = numberOfAnswersPerQuestion * 2,
                    CreatedDate = createdDate,
                    LastModifiedDate = createdDate
                });
            }
            dbContext.SaveChanges();
        }
        #endregion
    }
}
