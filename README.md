# tabletext

### Parse table-like string to object array, and reversely stringify object array to table-like string.

## Installation

```javascript
npm install tabletext --save-dev
```

> This project already contains typings files

## Usage

```typescript
import TableText from 'tabletext'
const data: object[] = TableText.parse(`
    // Support for parallel slash annotations
    // The first line will be identified as keys
    |  id   | gender |  age
    |  1    |   1    |   16
    |  2    |   0    |   24
`)
/* [
    {id: '1', gender: '1', age: '16'},
    {id: '2', gender: '0', age: '24'}
]*/
```

## Introduction

### TableText.parse(tableLikeString: string, decode?: boolean) : { [key: string]: string }[]

- Parallel slash annotations is supported, which would be removed before parsing.
- The first line would be identified as keys.
- The first letter of the line is a delimiter, tell the parser how to split that line.
- The delimiter should be a punctuations
- When decode param was true, the keys and values would be decoded by `window.unescape`

```typescript
TableText.parse(`   
    #  id   # gender #  age
    |  1    |   1    |   16
    ,  2    ,   0    ,   24
`)
/* [
    {id: '1', gender: '1', age: '16'},
    {id: '2', gender: '0', age: '24'}
] */

TableText.parse(`   
    // decode
    #  id   #  punctuation  
    &  1    &   %26   
    =  2    =   %3D     
`, true)
/* [
    {id: '1', punctuation: '&' },
    {id: '2', punctuation: '=' }
] */
```

### TableText.stringify(plainObjectArray: { [key: string]: string }[], encode?: boolean): string

 ```typescript
TableText.stringify([
    {id: '1', gender: '1', age: '16'},
    {id: '2', gender: '0', age: '24'}
])
/* 
    `,id,gender,age
    ,1,1,16
    ,2,0,24`
 */

TableText.stringify([
    {id: '1', punctuation: '&' },
    {id: '2', punctuation: '=' }
], true)
/*  
    `,id,punctuation
    ,1,%26
    ,2,%3D
*/
```

### TableText.validate(tableLikeString: string, decode?: boolean): { valid: boolean; message?: string }

 ```typescript
 // false
TextTable.validate(
    `
    #  id   #  gender #   age
    的  1    的   1    的   16
    ,  2    ,   0    ,   24
    `
) === false 
TextTable.validate(` `) === false
TextTable.validate(`
    3
    3
`) === false
TextTable.validate(`
    , 3

`) === false
TextTable.validate(`, 3`) === false
TextTable.validate(`
    , 3
    是 3
`) === false
TextTable.validate(`
    , 3
    a 3
`) === false
TextTable.validate(`
    , 试试
    , 3
`) === false
TextTable.validate(`
    , ?
    , 3
`) === false
TextTable.validate(`
    , ?
    , 3,,
`) === false
```


