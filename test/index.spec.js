const expect = require('chai').expect;
const TextTable = require('../texttable');
describe('TextTable', function() {
	it('parse', async () => {
		const res = TextTable.parse(`
            // 双斜杠不会被识别
            // 第一行会被识别为 keys
            // 用户id    性别       年龄
            #  id   #  gender #   age
            ,  1    ,   1    ,   16
            ,  2    ,   0    ,   24
        `);

		expect([ { id: '1', gender: '1', age: '16' }, { id: '2', gender: '0', age: '24' } ]).to.eql(res);

		const res2 = TextTable.parse(`
            // 双斜杠不会被识别
            // 第一行会被识别为 keys
            // 用户id    性别       年龄
            #  id   #  gender #   age
            ;  1    ;   1    ;   16
            ,  2    ,   0    ,   24
        `);

		expect([ { id: '1', gender: '1', age: '16' }, { id: '2', gender: '0', age: '24' } ]).to.eql(res2);

		const res3 = TextTable.parse(
			`
            // 双斜杠不会被识别
            // 第一行会被识别为 keys， 支持三种数据类型
            // 用户id    性别       年龄
            #  id   #  gend109890sd8f%28*%29  #   ag#e  #   say
            ,  1    ,   1  ,
            ,       ,   0    ,   24
            ,       ,   0    ,   24,, 33,,
        `,
			true
		);

		expect([
			{
				id: '1',
				'gend109890sd8f(*)': '1',
				ag: '',
				e: undefined,
				say: undefined
			},
			{
				id: '',
				'gend109890sd8f(*)': '0',
				ag: '24',
				e: undefined,
				say: undefined
			},
			{ id: '', 'gend109890sd8f(*)': '0', ag: '24', e: '', say: '33' }
		]).to.eql(res3);
	});

	it('stringify', async () => {
		const res = TextTable.stringify([ { 'asdf/&&': '190=', b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 } ], true);
		expect(`asdf/%26%26,b
190%3D,2
1,2
1,2`).to.eq(res);

		const res2 = TextTable.stringify([ { 'asdf*(=)': '109890sd8f(*)', b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 } ]);
		expect(`asdf*(=),b
109890sd8f(*),2
1,2
1,2`).to.eq(res2);
	});

	it.only('validate false', async () => {
		let res = TextTable.validate(`
            // 双斜杠不会被识别
            // 第一行会被识别为 keys
            // 用户id    性别       年龄
            #  id   #  gender #   age
            的  1    的   1    的   16
            ,  2    ,   0    ,   24
        `);
		expect(res.valid).to.false;

		res = TextTable.validate(` `);
		expect(res.valid).to.false;
		res = TextTable.validate(` 3
        3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, 3
        是 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, 3
        a 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, 试试
        , 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, ?
        , 3`);
		expect(res.valid).to.false;
		res = TextTable.validate(`, ?
        , 3,,`);
		expect(res.valid).to.false;
	});

	it.only('validate true', async () => {
		let res = TextTable.validate(`, 3
        ,3`);
		expect(res.valid).to.true;
	});
});
