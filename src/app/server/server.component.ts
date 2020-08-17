import { Component, OnInit } from '@angular/core';
import {timeout} from "rxjs/operators";

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {

  graphic = 'Graphic Design!';
  status = 'Working on the design...';

  allowNewNode = false;
  nodeStatus = '';
  nodeName = '';

  constructor() {
    setTimeout(() => {
      this.allowNewNode = true;
    }, 2000);
  }

  ngOnInit(): void {
  }

  getStatus() {
    return this.status;
  }

  onCreateNode() {
    this.status = this.nodeStatus + 'Name is: ' + this.nodeName;
  }

  onUpdateNodeName(event: Event) {
    this.nodeStatus = (<HTMLInputElement>event.target).value;
  }

}
