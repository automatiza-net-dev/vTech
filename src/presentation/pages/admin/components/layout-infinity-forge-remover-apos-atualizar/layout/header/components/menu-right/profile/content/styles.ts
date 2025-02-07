import styled from 'styled-components'

export const Content = styled.div`
  width: 100%;
  min-width: 22rem;
  text-align: left;
  direction: ltr;

  .rtl & {
    direction: rtl;
    text-align: right;
  }

  .user-profile {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d1d5db;
    padding: 1.5rem 1.5rem 1.25rem;
    gap: 1rem;
  }

  .user-info {
    h6 {
      font-weight: 600;
      margin: 0 0 2px 0;
      color: #000;
    }

    p {
      color: #4b5563;
    }

    .email {
      max-width: 260px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
  }

  .menu {
    display: grid;
    padding: 0.875rem;
    font-weight: 500;
    color: #374151;

    a {
      color: #333333;
    }
  }

  .menu-item {
    margin: 0.125rem 0;
    display: flex;
    align-items: center;
    border-radius: 0.375rem;
    padding: 1rem;
    text-decoration: none;
    color: inherit;

    &:hover,
    &:focus {
      background-color: #f3f4f6;
    }
  }

  .sign-out-button {
    width: 100%;
    justify-content: start;
    padding: 0;
    font-weight: 500;
    color: #374151;
    background: none;
    border: none;
    text-align: left;

    &:hover,
    &:focus-within {
      color: #1f2937;
    }
  }

  .divider {
    border-top: 1px solid #d1d5db;
    transition: background 0.1s ease-in-out;

    &:hover,
    &:focus {
      background: #e72e3f;

      button {
        color: #fff;
      }
    }

    button {
      cursor: pointer;
      padding: 1.25rem 1.5rem;
    }
  }
`
