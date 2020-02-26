import {Pipe, PipeTransform } from '@angular/core';
import {fs} from 'file-system';
import {TranslateService} from './translate.service';

@Pipe ({name: 'translator', pure: false})
export class TranslatorPipe implements PipeTransform {

  constructor(private _translate: TranslateService) {}

  transform(value_to_set, foo: boolean): string {
    return this._translate.translate(value_to_set);
  }
}
