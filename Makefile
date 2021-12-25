METEOR = ~/.meteor/meteor
METEOR_DIR = meteor_server

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
