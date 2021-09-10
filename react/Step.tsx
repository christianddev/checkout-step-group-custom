import classNames from 'classnames'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useStepContext } from './StepGroup'

const CSS_HANDLES = [
  'step',
  'stepTitle',
  'stepContentWrapper',
  'stepContent',
  'stepDivider',
  'indicator',
  'indicatorActive',
  'indicatorInactive',
] as const

const useStepIndicator = (elementRef: React.RefObject<HTMLLIElement>) => {
  const indexRef = useRef<number>(-1)
  const { assigning, items, updateParent, ...context } = useStepContext()

  useLayoutEffect(() => {
    if (!assigning.current) {
      return
    }

    indexRef.current = items.current.push(elementRef.current!) - 1
    updateParent()
  })

  return {
    // index is wrong on the first render, but the parent forces a
    // synchronous second render that fixes its value without flashing
    // the component
    index: indexRef.current,
    lastIndex: items.current.length - 1,
    ...context,
  }
}

interface StepProps {
  title: React.ReactNode
  'data-testid'?: string
  actionButton?: React.ReactNode
  active?: boolean
}

const Step: React.FC<StepProps> = ({
  children,
  title,
  'data-testid': dataTestId,
  active = false,
  actionButton = null,
}) => {
  const elementRef = useRef<HTMLLIElement>(null)
  const { index, lastIndex, activeIndex, setActive } = useStepIndicator(
    elementRef
  )

  useEffect(() => {
    if (!active) {
      return
    }

    setActive(elementRef.current!)

    return () => setActive(undefined)
  }, [active, index, setActive])

  const handles = useCssHandles(CSS_HANDLES)

  const isActive = activeIndex === index

  const borderWidth = (index ?? 0) < lastIndex ? 1 : 0

  return (
    <li
      className={classNames(handles.step, 'flex flex-wrap items-center')}
      ref={elementRef}
    >
      <span
        className={classNames(
          handles.indicator,
          'w1 h1 br-100 b flex items-center justify-center',
          {
            [handles.indicatorInactive]: !isActive,
            [handles.indicatorActive]: isActive,
            'bg-muted-5 c-on-muted-5 pa2 pa3-ns f6 f5-ns': !isActive,
            'bg-muted-4 c-on-muted-4 na2-ns pa3 pa4-ns f5 f4-ns': isActive,
          }
        )}
      >
        {index + 1}
      </span>
      <span
        className={classNames(
          handles.stepTitle,
          'flex items-center lh-copy ml3 ml4-ns pl2-ns',
          {
            'c-muted-1': activeIndex !== undefined && !isActive,
          }
        )}
      >
        <h2 className={classNames('mv0 fw6', { f5: !active, f4: active })}>
          {title}
        </h2>
        {actionButton && (
          <div className="pl4" data-testid={dataTestId}>
            {actionButton}
          </div>
        )}
      </span>
      <div
        className={classNames(
          handles.stepContentWrapper,
          'mt4 mb6 mb7-ns w-100 flex',
          {
            'mt3-ns': !active,
            'mt5-ns': active,
          }
        )}
      >
        <div
          style={{ width: borderWidth, minWidth: borderWidth }}
          className={classNames(
            handles.stepDivider,
            'dn db-ns bg-muted-4 nt4 nb6 nb7-ns mh5',
            {
              'nt3-ns': !active,
              'nt5-ns': active,
            }
          )}
        />
        <div className={classNames(handles.stepContent, 'ml5-ns w-100 pr8-ns')}>
          {children}
        </div>
      </div>
    </li>
  )
}

export default Step
