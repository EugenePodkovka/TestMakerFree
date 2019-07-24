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

        //TO-DO: check the syntax
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
}