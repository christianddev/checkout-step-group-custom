import React, {
  useMemo,
  useRef,
  useContext,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { OrderForm } from 'vtex.order-manager'
import { Alert } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'

const { useOrderForm } = OrderForm

/**
 * The component below is implemented following the "guidelines" of
 * this [1] gist. It is known that creating compound components in React
 * that have a strong relation of parent-child (like a select and their
 * option's) is hard, and there is currently no good way to implement this
 * because of the lack of primitives in the library.
 *
 * [1] https://gist.github.com/ryanflorence/10e9387f633f9d2e6f444a9bddaabf6e
 */

interface StepContext {
  items: React.MutableRefObject<HTMLLIElement[]>
  assigning: React.MutableRefObject<boolean>
  activeIndex: number | undefined
  updateParent: () => void
  setActive: (element: HTMLLIElement | undefined) => void
}

const ctx = React.createContext<StepContext | undefined>(undefined)

const useForceUpdate = (): [object, () => void] => {
  const [sentinel, setSentinel] = useState<object>({})

  return [
    sentinel,
    useCallback(() => {
      setSentinel({})
    }, []),
  ]
}

export const useStepContext = () => {
  const value = useContext(ctx)

  if (!value) {
    throw new Error('useStepContext must be used inside a <StepGroup />')
  }

  return value
}

const classes = [
  'stepGroupWrapper',
  'stepGroupList',
  'stepGroupCheckoutLabel',
  'stepGroupAlert',
] as const

const StepGroup: React.FC = ({ children }) => {
  const { orderForm } = useOrderForm()
  const intl = useIntl()
  const [alertOpen, setAlertOpen] = useState(!orderForm.canEditData)

  const [activeElement, setActive] = useState<HTMLLIElement | undefined>(
    undefined
  )

  const assigning = useRef(true)

  const [sentinel, forceUpdate] = useForceUpdate()
  const stepListRef = useRef<HTMLLIElement[]>([])

  const cssHandles = useCssHandles(classes)

  useLayoutEffect(() => {
    if (assigning.current) {
      // At this point all of the children have pushed into the array so we set
      // assigning to false and force an update. Since we're in
      // useLayoutEffect, we won't get a flash of rendered content, it will all
      // happen synchronously. And now that this is false, children won't push
      // into the array on the forceUpdate
      assigning.current = false
      forceUpdate()
    } else {
      // After the forceUpdate completes, we end up here and set assigning back
      // to true for the next update from the app
      assigning.current = true
    }

    return () => {
      // this cleanup function runs right before the next render, so it's the
      // right time to empty out the array to be reassigned with whatever shows
      // up next render.
      if (assigning.current) {
        // we only want to empty out the array before the next render cycle if
        // it was NOT the result of our forceUpdate, so being guarded behind
        // assigning.current works
        stepListRef.current = []
      }
    }
  }, [forceUpdate, sentinel])

  const contextValue = useMemo(
    () => ({
      activeIndex: activeElement && stepListRef.current.indexOf(activeElement),
      setActive,
      items: stepListRef,
      assigning,
      updateParent: forceUpdate,
      sentinel,
    }),
    [activeElement, forceUpdate, sentinel]
  )

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  return (
    <ctx.Provider value={contextValue}>
      <div className={cssHandles.stepGroupWrapper}>
        <h3
          className={`${cssHandles.stepGroupCheckoutLabel} c-muted-1 f5 mb5 mb6-ns mt7 pt4`}
        >
          <FormattedMessage id="store/checkout-label" />
        </h3>
        {alertOpen && (
          <div className={`${cssHandles.stepGroupAlert} mb5 mb6-ns`}>
            <Alert
              type="success"
              closeIconLabel={intl.formatMessage({
                id: 'store/checkout-autofill-close-label',
              })}
              onClose={handleAlertClose}
            >
              <FormattedMessage id="store/checkout-autofill-message" />
            </Alert>
          </div>
        )}
        <ol className={`${cssHandles.stepGroupList} pa0 ma0`}>{children}</ol>
      </div>
    </ctx.Provider>
  )
}

export default StepGroup
