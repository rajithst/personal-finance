import { Component, inject, OnInit, signal } from '@angular/core';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { ApiService } from '../../../core/api.service';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import {DatePipe, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {TransactionColumnMap, TransactionRelatedColumns} from './activity-log-const';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    RouterLink,
    MatButton,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
  ],
  providers: [DatePipe],
})
export class ActivityLog implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly datePipe = inject(DatePipe);
  activities = signal<any>([]);

  ngOnInit(): void {
    this.apiService.activityLog().then((result) => {
      const logEntries = result.data.map((entry: any) => {
        return {
          ...entry,
          action_text: this.getActionName(entry),
          section_text: this.getSectionName(entry),
          changes: this.prepareChanges(entry),
          timestamp: this.datePipe.transform(entry.timestamp, 'medium'),
          url: this.getObjectUrl(entry),
        };
      });
      this.activities.set(logEntries);
    });
  }

  private getActionName(entry: any): string {
    let action = '';
    if (entry.action === 'create') {
      action = `Created`;
    } else if (entry.action === 'update') {
      action = `Updated`;
    } else if (entry.action === 'delete') {
      action = `Deleted`;
    } else {
      action = `Performed action`;
    }
    return action;
  }

  private getObjectUrl(entry: any): string {
    let url = '';
    if (entry.section === 'transaction') {
      url = `/finance/${entry.object_id}`;
    } else if (entry.section === 'payee') {
      url = `/payee-settings/${entry.object_id}/`;
    } else if (
      entry.section === 'category' ||
      entry.section === 'subcategory'
    ) {
      url = `/finance-settings/category`;
    } else if (entry.section === 'account') {
      url = `/finance-settings/credit-accounts`;
    }
    return url;
  }

  private getSectionName(entry: any): string {
    let section = '';
    if (entry.section === 'transaction') {
      section = `Transaction`;
    } else if (entry.section === 'payee') {
      section = `Payee Settings`;
    } else if (entry.section === 'category') {
      section = `Category Settings`;
    } else if (entry.section === 'subcategory') {
      section = `Subcategory Settings`;
    } else if (entry.section === 'account') {
      section = `Credit Account Settings`;
    }
    return section;
  }
  private prepareChanges(entry: any) {
    if (!entry.changelog || Object.keys(entry.changelog).length === 0) {
      return 'No changes made.';
    }
    const changedFields = Object.keys(entry.changelog);
    const changes = entry.changelog;
    let changelog = [];
    for (const field of changedFields) {
      if (field in TransactionColumnMap) {
        if (field in TransactionRelatedColumns) {
          let relatedObjectName = '';
          changelog.push({
            field: TransactionRelatedColumns[field],
            oldValue: changes[field].old_text ?? 'N/A',
            newValue: relatedObjectName,
          });
          continue;
        }
        let oldValue = changes[field].old;
        let newValue = changes[field].new;
        changelog.push({
          field: TransactionColumnMap[field],
          oldValue: oldValue !== null ? oldValue : 'N/A',
          newValue: newValue !== null ? newValue : 'N/A',
        });
      }
    }
    return changelog;
  }
}
