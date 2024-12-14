import { type MessageDescriptor } from '@lingui/core';
import { Trans } from '@lingui/react';
import _ from 'lodash';

export function I18nString({ value }: { value: string | MessageDescriptor }) {
  if (_.isString(value)) {
    return value;
  }
  return <Trans {...value} />;
}
