import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "quiz",
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css']
})

export class QuizComponent {
    quiz: Quiz | undefined;

    constructor(private activateRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {

        var id = +this.activateRoute.snapshot.params["id"];
        console.log(id);
        if (id) {
            var url = baseUrl + "api/quiz/" + id;
            this.http.get<Quiz>(url).subscribe(result => {
                this.quiz = result;
            }, error => console.log(error));
        } else {
            console.log("Invalid Id: routing back to home");
            this.router.navigate(["home"]);
        }
    }

    onEdit() {
        if (this.quiz) {
            this.router.navigate(["quiz/edit", this.quiz.Id]);
        }
        else {
            console.log("Invalid quiz: routing back to home");
            this.router.navigate(["home"]);
        }
    }

    onDelete() {
        if (this.quiz) {
            if (confirm("Do you want to delete the quiz?")) {
                var url = this.baseUrl + "api/quiz/" + this.quiz.Id;
                this.http.delete(url, { responseType: 'text' }).subscribe(res => {
                    if (this.quiz) {
                        console.log("Quiz with Id=" + this.quiz.Id + " has been deleted.");
                        this.router.navigate(["home"]);
                    }
                    else {
                        console.log("Invalid delete request: Exception:" + res);
                    }
                })
            }
        }
        else {
            console.log("Invalid quiz: routing back to home");
            this.router.navigate(["home"]);
        }
    }
}