﻿import { Component, Inject, Input, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
    selector: "quiz-list",
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})

export class QuizListComponent implements OnInit {
    @Input() class: string | undefined;
    title: string | undefined;
    selectedQuiz: Quiz | undefined;
    quizzes: Quiz[] | undefined;

    constructor(private http: HttpClient, @Inject('BASE_URL')
        private baseUrl: string,
        private router: Router) {
    }

    ngOnInit() {
        var url = this.baseUrl + "api/quiz/";
        switch (this.class) {
            case "latest":
            default:
                this.title = "Latest quizzes";
                url += "Latest/";
                break;
            case "byTitle":
                this.title = "Quizzes by title";
                url += "ByTitle/";
                break;
            case "random":
                this.title = "Random quizzes";
                url += "Random/";
                break;
        }
        //async web service call with subscribtion on callback
        this.http.get<Quiz[]>(url).subscribe(result => {
            this.quizzes = result;
        }, error => console.log(error));
    }

    onSelect(quiz: Quiz) {
        this.selectedQuiz = quiz;
        console.log("quiz with Id " + this.selectedQuiz.Id + " has been selected.");
        this.router.navigate(["quiz", this.selectedQuiz.Id]);
    }
}