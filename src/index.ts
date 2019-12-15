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
  let knownComponent = options.knownComponent || [];
  let knownModule = options.knownModule || [];

  const isFirstPartyModule = (imported: IImport) =>
    knownFirstParty.some(prefix => imported.moduleName.startsWith(prefix));

  const isComponentsModule = (imported: IImport) =>
    knownComponent.some(prefix => imported.moduleName.startsWith(prefix));

  const isModulesModule = (imported: IImport) => knownModule.some(prefix => imported.moduleName.startsWith(prefix));

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
     * Known first-party module modules.
     *
     * @example import … from '~/moduless/foo'
     */
    {
      match: and(isAbsoluteModule, isModulesModule),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    {separator: true},

    /**
     * Known first-party component modules.
     *
     * @example import … from '~/components/foo'
     */
    {
      match: and(isAbsoluteModule, isComponentsModule),
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
      match: and(isAbsoluteModule, isFirstPartyModule, not(isModulesModule), not(isComponentsModule)),
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
