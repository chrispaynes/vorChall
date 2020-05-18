import { Component, OnInit, Input, HostListener } from '@angular/core';
import {
  FormControl,
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { TodoService } from '../todo.service';
import {
  Todo,
  TodoEdit,
  DefaultTemplateDescription,
  DefaultTemplateTitle,
} from '../todo';
import { map, tap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    this.editMode = false;
  }

  controls: FormArray;
  editMode: boolean = false;
  originalTitle: string = '';
  originalDescription: string = '';
  form: FormGroup;

  constructor(
    private _todoService: TodoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [this.todo.title, Validators.required],
      description: [this.todo.description, Validators.required],
    });

    this.originalTitle = this.todo.title;
    this.originalDescription = this.todo.description;

    this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((edit: TodoEdit) => {
      // if the todo's updated title or description don't match its original,
      // assign the properties and consider the todo dirty. otherwise consider
      // the todo unchangeds
      if (
        edit.title !== this.originalTitle ||
        edit.description !== this.originalDescription
      ) {
        Object.assign(this.todo, {
          ...edit,
          _isDirty: true,
        });
      } else {
        Object.assign(this.todo, {
          ...edit,
          _isDirty: false,
        });
      }
    });
  }

  public onFocus(event) {
    if (!event) {
      this.editMode = false;
    }

    console.log('FOCUS', event);
  }

  public onEdit(todo: Todo) {
    this.editMode = true;
  }

  public onDelete(todo: Todo) {
    console.log('onDelete', todo);
  }

  public onAdd(todo: Todo) {
    console.log('onAdd', todo);

    if (this.shouldDisableSave(todo)) {
      return
    }

    this.reloadTodo(this._todoService.addTodo(todo));
  }

  public shouldDisableSave(todo: Todo): boolean {
    return (
      todo.title === '' ||
      todo.description == '' ||
      todo.title === DefaultTemplateTitle ||
      todo.description == DefaultTemplateDescription
    );
  }

  public onUpdate(todo: Todo) {
    console.log('onUpdate', todo);
  }

  // loadTodos loads todos from a datasource
  private reloadTodo(dataSource: Observable<Todo>) {
    from(dataSource)
      .pipe(tap((todo: Todo) => (this.todo = todo)))
      .subscribe();
  }
}
