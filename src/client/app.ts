import {Component, Directive, ElementRef, Renderer, OnInit, Injectable} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Http, HTTP_PROVIDERS, URLSearchParams} from 'angular2/http';
import {OperationError, OperationSuccess, OperationResponse} from '../common/operation-response';
import {AppQuery} from '../common/app-query';
import 'rxjs/Rx';



@Directive({
  selector: '[x-large]'
})
export class XLarge {
  constructor(element: ElementRef, renderer: Renderer) {
    // we must interact with the dom through Renderer for webworker/server to see the changes
    renderer.setElementStyle(element, 'fontSize', 'x-large');
  }
}

@Injectable()
class Api {
  constructor(private http: Http) {}

  getPDFUrl(query : AppQuery) {
    const endpoint = '/download';
    let searchparams = new URLSearchParams();

    searchparams.set('startUnit', query.startUnit.toString());
    searchparams.set('endUnit', query.endUnit.toString());
    searchparams.set('lesson', query.lesson.toString());
    searchparams.set('url', query.url);
    searchparams.set('username', query.username);
    searchparams.set('password', query.password);

    return this.http
      .get(endpoint, {search: searchparams})
      .map(res => res.json());
  }
}


@Component({
  selector: 'home',
  viewProviders: [HTTP_PROVIDERS, Api],
  templateUrl: 'views/home.html'
})
export class Home {
  public url : string = '';
  public username: string = '';
  public password: string = '';
  public lesson: number = null;
  public startUnit: number = null;
  public endUnit: number = null;

  private submited: boolean = false;
  public downloadUrl : string = null;
  public errorMessage : string = null;

  constructor(private api: Api){

  }

  onSubmit($event: Event) {
    $event.preventDefault();
    if (this.submited) return;

    this.submited = true;

    //Reset context
    this.downloadUrl = this.errorMessage = null;

    let myResponse : OperationResponse;
    this.api.getPDFUrl({
        url: this.url,
        username: this.username,
        password: this.password,
        lesson: this.lesson,
        startUnit: this.startUnit,
        endUnit: this.endUnit
      })
      .subscribe(response => {
        myResponse = <OperationSuccess> response;
        console.log(response);
        this.downloadUrl = myResponse.success.data;
        this.submited = false;
      }, response => {
        try {
          console.log(response);
          myResponse = <OperationError> response.json();
          this.errorMessage = myResponse.error;
        } catch (e){
          this.errorMessage = 'Invalid response';
        }
        this.submited = false;
      });
  }


}

@Component({
  selector: 'about',
  template: `
  About
  `
})
export class About {
}

@Component({
  selector: 'app',
  directives: [ ...ROUTER_DIRECTIVES, XLarge ],
  template: `
  <div class="container">
    <main>
      <router-outlet></router-outlet>
    </main>
  </div>
  `
})
@RouteConfig([
  { path: '/', component: Home, name: 'Home' },
  { path: '/home', component: Home, name: 'Home' },
  { path: '/about', component: About, name: 'About' },
])
export class App {
  name: string = 'AngularConnect';
}
