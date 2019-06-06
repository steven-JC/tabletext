(function() {
	const TextTable = {
		/**
         * // 双斜杠不会被识别
         * // 第一行会被识别为 keys
         * // 用户id    性别       年龄
         * #  id   #  gender #   age
         * ,  1    ,   1    ,   16
         * ,  2    ,   0    ,   24
         */
		parse: function(tableString, decode) {
			const strRows = tableString
				.replace(/\s*\/\/.*(?:\r|\n|$)/g, '')
				.split(/\n/)
				.map((item) => item.trim())
				.filter((item) => !!item);
			const split = strRows.map((item) => item[0]);
			const keys = strRows
				.shift()
				.substr(1)
				.split(split[0])
				.map((item) => (decode && item.trim() ? unescape(item.trim()) : item.trim()));
			const rows = strRows.map((item, i) => {
				const row = item.substr(1).split(split[i + 1]).map((item) => {
					return item.trim();
				});
				const obj = {};
				keys.forEach((item, i) => {
					obj[item] = decode && row[i] ? unescape(row[i]) : row[i];
				});
				return obj;
			});
			return rows;
		},
		stringify: function(plainObjectArray, encode) {
			let keysStr = Object.keys(plainObjectArray[0]).map((item) => (encode ? escape(item) : item)).join(',');
			const strRows = plainObjectArray.map((item) => {
				return Object.keys(item).map((key) => (encode ? escape(item[key]) : item[key])).join(',');
			});
			strRows.unshift(keysStr);
			return strRows.join('\n');
		},
		validate: function(tableString, decode) {
			if (!tableString || !tableString.trim()) {
				return {
					valid: false,
					message: '字符串不能为空'
				};
			}
			let res = [];
			const strRows = tableString
				.replace(/\s*\/\/.*(?:\r|\n|$)/g, '')
				.split(/\n/)
				.map((item) => item.trim())
				.filter((item) => !!item);
			if (strRows.length < 2) {
				return {
					valid: false,
					message: '至少包含两行内容.'
				};
			}
			const split = strRows.map((item) => item[0]);
			if (split.some((item) => item.charCodeAt(0) > 127 || /\w/.test(item))) {
				return {
					valid: false,
					message: '每行第一个字符为分隔符，应为英文符号，如：,|$%#@!&/ 等'
				};
			}
			const keys = strRows
				.shift()
				.substr(1)
				.split(split[0])
				.map((item) => (decode && item.trim() ? unescape(item.trim()) : item.trim()));
			if (keys.some((item) => !/\w/.test(item))) {
				return {
					valid: false,
					message: '第一行内容为字段名，仅支持字母、数字、下划线组合'
				};
			}
			let err;
			strRows.forEach((item, i) => {
				const row = item.substr(1).split(split[i + 1]).map((item) => {
					return item.trim();
				});
				if (row.length !== keys.length) {
					err = {
						valid: false,
						message: '请检查每行的分隔符数量相同'
					};
				}
			});
			if (err) {
				return err;
			} else {
				return { valid: true, message: '' };
			}
		}
	};

	if (typeof module === 'object' && module.exports) {
		module.exports = TextTable;
	} else if (typeof define === 'function' && define.amd) {
		define(function() {
			return TextTable;
		});
	} else if (typeof window !== undefined) {
		return (window.TextTable = TextTable);
	}
})();
