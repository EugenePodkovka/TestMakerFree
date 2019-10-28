import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: "answer-edit",
    templateUrl: "./answer-edit.component.html",
    styleUrls: ["./answer-edit.component.css"]
})

export class AnswerEditComponent {
    title: string | undefined;
    answer: Answer | undefined;
    editMode: boolean | undefined;
    form: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.answer = <Answer>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        this.createForm();

        if (this.editMode) {
            var url = this.baseUrl + "api/answer/" + id;
            this.http.get<Answer>(url).subscribe(res => {
                this.answer = res;
                this.title = "Edit - " + this.answer.Text;

                this.updateForm();
            }, error => console.log(error));
        }
        else {
            this.answer.QuestionId = id;
            this.title = "Create a new Answer";
        }
    }

    createForm() {
        this.form = this.fb.group({
            Text: ['', Validators.required],
            Value: ['',
                [
                    Validators.required,
                    Validators.min(-4),
                    Validators.max(5)
                ]
            ]
        });
    }

    updateForm() {
        this.form.setValue({
            Text: this.answer.Text || '',
            Value: this.answer.Value || 0
        })
    }

    onSubmit() {
        var url = this.baseUrl + "api/answer";

        var tempAnswer = <Answer>{};
        tempAnswer.Text = this.form.value.Text;
        tempAnswer.Value = this.form.value.Value;
        tempAnswer.Id = this.answer.Id;
        tempAnswer.QuestionId = this.answer.QuestionId;


        if (this.editMode) {
            this.http.post<Answer>(url, tempAnswer).subscribe(res => {
                console.log("Answer with Id=" + res.Id + " was updated.");
                this.router.navigate(["/question/edit/" + res.QuestionId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Answer>(url, tempAnswer).subscribe(res => {
                console.log("Answer with Id=" + res.Id + " was created.");
                this.router.navigate(["/question/edit/" + res.QuestionId]);
            }, error => console.log(error));
        }
    }

    onBack(answer: Answer) {
        this.router.navigate(["/question/edit/" + answer.QuestionId]);
    }

    getFormControl(name: string) {
        var e = this.form.get(name);
        return e;
    }

    isValid(name: string) {
        var e = this.form.get(name);
        var res = e && e.valid;
        return res;
    }

    isChanged(name: string) {
        var e = this.form.get(name);
        var res = e && (e.dirty || e.touched);
        return res;
    }

    hasError(name: string) {
        var e = this.form.get(name);
        var res = e && (e.touched || e.dirty) && !e.valid;
        return res;
    }
}