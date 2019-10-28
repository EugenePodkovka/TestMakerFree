import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "result-edit",
    templateUrl: "./result-edit.component.html",
    styleUrls: ["./result-edit.component.css"]
})

export class ResultEditComponent {
    title: string | undefined;
    result: Result | undefined;
    editMode: boolean | undefined;
    form: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        this.result = <Result>{};
        var id = +this.activatedRoute.snapshot.params["id"];
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        this.createForm();

        if (this.editMode) {
            var url = this.baseUrl + "api/result/" + id;
            this.http.get<Result>(url).subscribe(res => {
                this.result = res;
                this.title = "Edit - " + this.result.Text;

                this.updateForm();
            }, error => console.log(error));
        }
        else {
            this.result.QuizId = id;
            this.title = "Create a new Result";
        }
    }

    createForm() {
        this.form = this.fb.group({
            Text: ['', Validators.required],
            MinValue: ['', Validators.pattern(/^\d*$/)],
            MaxValue: ['', Validators.pattern(/^\d*$/)]
        });
    }

    updateForm() {
        this.form.setValue({
            Text: this.result.Text,
            MinValue: this.result.MinValue,
            MaxValue: this.result.MaxValue
        });
    }

    onSubmit() {
        var tempResult = <Result>{};
        tempResult.Text = this.form.value.Text;
        tempResult.MaxValue = this.form.value.MaxValue;
        tempResult.MinValue = this.form.value.MinValue;
        tempResult.Id = this.result.Id;
        tempResult.QuizId = this.result.QuizId;

        var url = this.baseUrl + "api/result";

        if (this.editMode) {
            this.http.post<Result>(url, tempResult).subscribe(res => {
                console.log("Result with Id=" + res.Id + " was updated.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
        else {
            this.http.put<Result>(url, tempResult).subscribe(res => {
                console.log("Result with Id=" + res.Id + " was created.");
                this.router.navigate(["/quiz/edit/" + res.QuizId]);
            }, error => console.log(error));
        }
    }
    onBack() {
            this.router.navigate(["/quiz/edit/" + this.result.QuizId]);
    }

    getFormControl(name: string) {
        var c = this.form.get(name);
        return c;
    }

    isValid(name: string) {
        var c = this.form.get(name);
        var res = c && c.valid;
        return res;
    }

    isChanged(name: string) {
        var c = this.form.get(name);
        var res = c && (c.dirty || c.touched);
        return res;
    }

    hasError(name: string) {
        var c = this.form.get(name);
        var res = c && (c.touched || c.dirty) && !c.valid;
        return res;
    }
}