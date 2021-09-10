# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0] - 2021-02-23
### Changed
- Added loading state for shipping and address step.

## [0.12.0] - 2021-02-22
### Added
- New address step block.

## [0.11.0] - 2021-01-18
### Added
- Do not show Icon Edit if the purchase is free

## [0.10.0] - 2021-01-05
### Added
- CSS handle to Step Group's alert: `stepGroupAlert`.

## [0.9.0] - 2020-07-13

## [0.8.1] - 2020-05-27
### Added
- Use testId on `Step` action button. 

## [0.8.0] - 2020-05-19
### Added
- Payment summary component from `checkout-payment` to payment step.

### Changed
- Use hidden attribute in payment step to avoid unmounting the card iframe.

## [0.7.0] - 2020-05-06
### Added
- Shipping form and shipping summary from `checkout-shipping`.

## [0.6.1] - 2020-05-06
### Fixed
- Step border collapsing on Firefox.

## [0.6.0] - 2020-03-31
### Added
- Profile form and summary components in `ProfileStep`.

## [0.5.2] - 2020-03-25
### Fixed
- Font weight of step title.

## [0.5.1] - 2020-03-24
### Changed
- Split `Step`'s `title` prop into `title` and `actionButton`.

### Fixed
- Font size of steps titles.

## [0.5.0] - 2020-03-11
### Added
- Payment component from `vtex.checkout-payment` app.

## [0.4.0] - 2020-03-09
### Added
- CSS handles to Step component: `step`, `stepTitle`, `indicator`, `indicatorActive`,
  `indicatorInactive`, `stepContentWrapper`, `stepDivider` and `stepContent`.
- Styles for mobile resolutions.

## [0.3.0] - 2020-03-09
### Added
- CSS handle to Step Group's checkout label: `stepGroupCheckoutLabel`.

### Changed
- Updated styles of Step Group's wrapper.

## [0.2.0] - 2020-03-03
### Added
- Components for default steps included in checkout: profile, shipping and payment.

## [0.1.0] - 2020-02-21
### Added
- Initial `StepGroup` and `Step` components.
