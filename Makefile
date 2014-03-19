.PHONY: check test jshint

MOCHA_OPTS= --check-leaks
REPORTER = dot

check: test jshint

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		test/webpay

jshint:
	git ls-files | grep js$$ | xargs ./node_modules/.bin/jshint
