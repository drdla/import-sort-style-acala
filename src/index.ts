import {IStyleAPI, IStyleItem} from 'import-sort-style';

declare type ImportType = 'import' | 'require' | 'import-equals' | 'import-type';
declare type NamedMember = {
  alias: string;
  name: string;
};

interface IImport {
  defaultMember?: string;
  end: number;
  importEnd?: number;
  importStart?: number;
  moduleName: string;
  namedMembers: NamedMember[];
  namespaceMember?: string;
  start: number;
  type: ImportType;
}

export default (styleApi: IStyleAPI, file?: string, options?: any): Array<IStyleItem> => {
  const {
    alias,
    and,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    not,
    unicode,
  } = styleApi;

  let knownFirstParty = options.knownFirstParty || [];
  let groupByPrefix1 = options.groupByPrefix1 || [];
  let groupByPrefix2 = options.groupByPrefix2 || [];
  let groupByPrefix3 = options.groupByPrefix3 || [];
  let groupByPrefix4 = options.groupByPrefix4 || [];

  const isFirstPartyModule = (imported: IImport) =>
    knownFirstParty.some(prefix => imported.moduleName.startsWith(prefix));
  const isGroup1 = (imported: IImport) => groupByPrefix1.some(prefix => imported.moduleName.startsWith(prefix));
  const isGroup2 = (imported: IImport) => groupByPrefix2.some(prefix => imported.moduleName.startsWith(prefix));
  const isGroup3 = (imported: IImport) => groupByPrefix3.some(prefix => imported.moduleName.startsWith(prefix));
  const isGroup4 = (imported: IImport) => groupByPrefix4.some(prefix => imported.moduleName.startsWith(prefix));

  return [
    /**
     * Absolute modules with side effects.
     *
     * @example import 'foo'
     */
    {match: and(hasNoMember, isAbsoluteModule)},
    {separator: true},

    /**
     * Relative modules with side effects.
     *
     * @example import './foo'
     */
    {match: and(hasNoMember, isRelativeModule)},
    {separator: true},

    /**
     * Standard Node.js modules.
     *
     * @example import … from 'fs'
     */
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Third-party modules.
     *
     * @example import … from 'foo'
     */
    {
      match: and(isAbsoluteModule, not(isFirstPartyModule)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Known first-party module modules - group 1.
     *
     * @example import … from '~/moduless/foo'
     */
    {
      match: and(isAbsoluteModule, isGroup1),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Known first-party module modules - group 2.
     *
     * @example import … from '~/moduless/bar'
     */
    {
      match: and(isAbsoluteModule, isGroup2),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Known first-party module modules - group 3.
     *
     * @example import … from '~/moduless/baz'
     */
    {
      match: and(isAbsoluteModule, isGroup3),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Known first-party module modules - group 4.
     *
     * @example import … from '~/moduless/woo'
     */
    {
      match: and(isAbsoluteModule, isGroup4),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Remaining known first-party modules.
     *
     * @example
     *  import … from '~/constants/foo'
     *  import … from '~/styles/foo'
     *  import … from '~/theme/foo'
     */
    {
      match: and(isAbsoluteModule, isFirstPartyModule, not(isGroup1), not(isGroup2), not(isGroup3), not(isGroup4)),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Explicitly local modules.
     *
     * @example
     *   import … from './foo'
     *   import … from '../foo'
     */
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    {separator: true},
  ];
};
