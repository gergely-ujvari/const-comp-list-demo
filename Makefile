DEPLOY_NAME = const-comp.meteorapp.com

METEOR = ~/.meteor/meteor
METEOR_DIR = meteor_server
PRETTIER = node_modules/.bin/prettier
PRETTIER_CONFIG = .prettierrc
ESLINT = node_modules/.bin/eslint
CYPRESS = node_modules/.bin/cypress

default: dev

~/.meteor:
	@echo Installing meteor
	@curl https://install.meteor.com/ | sh

.PHONY: _install-deps
_install-deps: ~/.meteor
	@echo Installing dependencies
	@cd $(METEOR_DIR) && $(METEOR) npm install

.PHONY: dev
dev: _install-deps
	@cd $(METEOR_DIR) && $(METEOR) --exclude-archs web.browser.legacy

.PHONY: clean
clean:
	@$(RM) -rf ./$(METEOR_DIR)/node_modules
	@$(RM) -rf ./$(METEOR_DIR)/.meteor/local
	@$(RM) -rf ./$(METEOR_DIR)/.meteor/test
	@echo All cleared

.PHONY: check-code-format
check-code-format:
	@echo Checking code format
	@cd $(METEOR_DIR) && $(PRETTIER) --config $(PRETTIER_CONFIG) -c "{client,server,imports}/**/*.{ts,tsx}"

.PHONY: format-code
format-code:
	@echo Formatting code
	@cd $(METEOR_DIR) && $(PRETTIER) --config $(PRETTIER_CONFIG) --write "{client,server,imports}/**/*.{ts,tsx}"

.PHONY: eslint
eslint:
	@echo Running linter
	@cd $(METEOR_DIR) && $(ESLINT) "**/*.{ts,tsx}"

.PHONY: deploy
deploy:
	@cd $(METEOR_DIR) && $(METEOR) deploy ${DEPLOY_NAME} --free --mongo

.PHONY: cypress
cypress:
	@cd $(METEOR_DIR) && $(CYPRESS) open

.PHONY: cypress-cli
cypress-cli:
	@cd $(METEOR_DIR) && $(CYPRESS) run
