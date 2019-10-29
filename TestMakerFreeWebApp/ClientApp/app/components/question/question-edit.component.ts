import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "question-edit",
    templateUrl: "./question-edit.component.html",
    styleUrls: ["./question-edit.component.css"]
})

export class QuestionEditComponent {
    title: string | undefined;
    question: Question | undefined;
    editMode: boolean | undefined;
    form: FormGroup;
    activityLog: string;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.question = <Question>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        this.createForm();

        if (this.editMode) {
            var url = this.baseUrl + "api/question/" + id;
            this.http.get<Question>(url).subscribe(res => {
                this.question = res;
                this.title = "Edit - " + this.question.Text;

                this.updateForm();
            }, error => console.log(error));
        }
        else {
            this.question.QuizId = id;
            this.title = "Create a new Question";
        }
    }

    createForm() {
        this.form = this.fb.group({
            Text: ['', Validators.required]
        });

        this.activityLog = '';
        this.log("Form has been initialized");

        this.form.valueChanges.subscribe(val => {
            if (this.form.dirty) {
                this.log("Form was updated by the user");
            }
            else {
                this.log("Form model has been loaded");
            }
        })
        this.form.get("Text")!.valueChanges.subscribe(res => {
            if (this.form.dirty) {
                this.log("The Text form control was updated with initial value")
            }
            else {
                this.log("The Text form control was updated by user");
            }

        })
    }

    log(str: string) {
        this.activityLog += "[" + new Date().toLocaleString() + "] " + str + "<br/>";
    }

    updateForm() {
        this.form.setValue({
            Text: this.question.Text
        });
    }

    onSubmit() {
        var url = this.baseUrl + "api/question";

        var tempQuestion = <Question>{};
        tempQuestion.Text = this.form.value.Text;
        tempQuestion.Id = this.question.Id;
        tempQuestion.QuizId = this.question.QuizId;

        if (this.editMode) {
            this.http.post<Question>(url, tempQuestion).subscribe(res => {
                console.log("Question with Id=" + res.Id + " was updated.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Question>(url, tempQuestion).subscribe(res => {
                console.log("Question with Id=" + res.Id + " was created.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
    }

    onBack(question: Question) {
            this.router.navigate(["/quiz/edit/" + question.QuizId]);
    }

    getFormControl(name: string) {
        return this.form.get(name);
    }

    isValid(name: string) {
        var e = this.form.get(name);
        var validationResult = e && e.valid;
        return validationResult;
    }

    isChanged(name: string) {
        var e = this.form.get(name);
        var result = e && (e.dirty || e.touched);
        return result;
    }

    hasError(name: string) {
        var e = this.form.get(name);
        var result = e && (e.dirty || e.touched) && !e.valid;
        return result;
    }
}