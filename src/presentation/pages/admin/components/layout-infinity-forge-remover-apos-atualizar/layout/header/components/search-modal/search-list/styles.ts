import styled from 'styled-components'

export const SearchList = styled.div`
  width: 100%;

  .header {
    display: flex; /* flex */
    align-items: center; /* items-center */
    justify-content: space-between;
    padding: 16px 20px;
    gap: 20px;

    div {
      width: 100%;
    }

    form {
      width: 100%;
      height: 40px;
      overflow: hidden;
    }

    input {
      width: 100%;
      height: 40px;
      background: #ebebeb;
      border-radius: 6px;
      opacity: 1;

      &::placeholder {
        color: #9b9b9b;
      }
    }

    .icon {
      color: #484848;
    }

    .close {
      padding: 0;
      background: none;
      border: 0;
      display: flex;
      width: 20px;
      height: 20px;
      align-items: center;
      cursor: pointer;

      svg {
        width: 100%;
        height: auto;
      }
    }
  }

  .list {
    max-height: 60vh; /* max-h-[60vh] */
    overflow-y: auto; /* overflow-y-auto */
    border-top: 1px solid rgba(209, 213, 219, 1); /* border-t border-gray-300 */
    padding: 1rem 0.5rem; /* px-2 py-4 */

    h6 {
      margin: 0;
      margin-bottom: 4px; /* mb-1 */
      padding: 0 12px; /* px-3 */
      letter-spacing: 0.05em; /* tracking-widest */
      color: #666666; /* text-gray-500 */

      @media (prefers-color-scheme: dark) {
        color: rgba(107, 114, 128, 1); /* dark:text-gray-500 */
      }

      &.last {
        margin-top: 1.5rem; /* mt-6 */
        @media (min-width: 1920px) {
          /* 4xl */
          margin-top: 1.75rem; /* 4xl:mt-7 */
        }
      }
    }

    .not-found {
      width: 100%;
      text-align: center;
      transform: scale(0.75);

      .icon {
        margin: 0 auto;
        width: 40px;
        height: 40px;
        display: flex;
        margin-bottom: 20px;

        g {
          fill: currentColor !important;
        }

        svg {
          width: 100%;
          height: auto;
        }
      }

      p {
        color: #484848;
      }
    }

    .item {
      position: relative; /* relative */
      margin: 2px 0; /* my-0.5 */
      display: flex; /* flex */
      align-items: center; /* items-center */
      border-radius: 0.5rem; /* rounded-lg */
      padding: 8px 12px; /* px-3 py-2 */
      outline: none; /* focus:outline-none */

      > .icon {
        display: inline-flex; /* inline-flex */
        align-items: center; /* items-center */
        justify-content: center; /* justify-center */
        border-radius: 0.375rem; /* rounded-md */
        border: 1px solid rgba(209, 213, 219, 1); /* border border-gray-300 */
        padding: 8px; /* p-2 */
        color: rgba(107, 114, 128, 1); /* text-gray-500 */

        svg {
          width: 20px;
          height: 20px;
        }
      }

      > .text-box {
        margin-left: 12px; /* ms-3 */
        display: grid; /* grid */
        gap: 0.125rem; /* gap-0.5 */

        .name {
          text-transform: capitalize; /* capitalize */
          color: rgba(17, 24, 39, 1); /* text-gray-900 */

          @media (prefers-color-scheme: dark) {
            color: rgba(55, 65, 81, 1); /* dark:text-gray-700 */
          }
        }

        .href {
          color: rgba(107, 114, 128, 1); /* text-gray-500 */
        }
      }

      &:hover {
        background-color: rgba(229, 231, 235, 1); /* hover:bg-gray-100 */
      }

      &:focus-visible {
        background-color: rgba(229, 231, 235, 1); /* focus-visible:bg-gray-100 */
      }

      @media (prefers-color-scheme: dark) {
        &:hover {
          background-color: rgba(156, 163, 175, 0.5); /* dark:hover:bg-gray-50/50 */
          backdrop-filter: blur(12px); /* dark:hover:backdrop-blur-lg */
        }
      }
    }
  }
`
