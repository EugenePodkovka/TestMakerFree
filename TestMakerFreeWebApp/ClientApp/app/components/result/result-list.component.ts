import { Component, Inject, Input, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "result-list",
    templateUrl: "./result-list.component.html",
    styleUrls: ["./result-list.component.css"]
})

export class ResultListComponent {
    @Input() quiz: Quiz | undefined;
    results: Result[] | undefined;
    title: string | undefined;

    constructor(private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string,
        private router: Router) {

        this.results = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (typeof changes['quiz'] !== 'undefined') {
            var change = changes['quiz'];
            if (!change.isFirstChange()) {
                this.loadData();
            }
        }
    }

    loadData() {
        if (this.quiz) {
            var url = this.baseUrl + "api/result/All/" + this.quiz.Id;
            this.http.get<Result[]>(url).subscribe(res => {
                this.results = res;
            }, error => console.log(error));
        }
        else {
            console.error("ResultListComponent.loadData: Quiz was not defined");
        }
    }

    onCreate() {
        if (this.quiz) {
            this.router.navigate(["/result/create", this.quiz.Id])
        }
        else {
            console.error("ResultListComponent.onCreate: Quiz was not defined");
        }
    }

    onEdit(result: Result) {
        this.router.navigate(["/result/edit", result.Id])
    }


    onDelete(result: Result) {
        if (confirm("Do you want to delete this result?")) {
            var url = this.baseUrl + "api/result/" + result.Id;
            this.http.delete(url, { responseType: 'text' }).subscribe(res => {
                console.log("Result with Id=" + result.Id + " has been deleted.");
                this.loadData();
            }, error => console.log(error));
        }
    }
}