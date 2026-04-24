import { GraphQLError } from 'graphql';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Register from './Register';
import { REGISTER_USER } from '../util/GraphQL';
import { renderWithProviders } from '../test/test-utils';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Register page', () => {
  it('declares the register input variable as non-null in the GraphQL document', () => {
    const mutationDefinition = REGISTER_USER.definitions.find((definition) => definition.kind === 'OperationDefinition');

    if (!mutationDefinition || mutationDefinition.kind !== 'OperationDefinition') {
      throw new Error('Missing register mutation definition');
    }

    const registerInputVariable = mutationDefinition.variableDefinitions?.find(
      (variable) => variable.variable.name.value === 'registerInput',
    );

    expect(registerInputVariable?.type.kind).toBe('NonNullType');
  });

  it('submits registration and redirects on success', async () => {
    const login = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<Register />, {
      mocks: [
        {
          request: {
            query: REGISTER_USER,
            variables: {
              registerInput: {
                username: 'alice',
                email: 'alice@example.com',
                password: 'Password1!',
                confirmPassword: 'Password1!',
                profilePicture: 'ade',
              },
            },
          },
          result: {
            data: {
              register: {
                id: 'user-1',
                username: 'alice',
                email: 'alice@example.com',
                createdAt: '2026-04-23T00:00:00.000Z',
                profilePicture: 'ade',
                token: 'signed-token',
                __typename: 'User',
              },
            },
          },
        },
      ],
      login,
    });

    await user.type(screen.getByPlaceholderText('Username'), 'alice');
    await user.type(screen.getByPlaceholderText('E-mail'), 'alice@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Password1!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password1!');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-1',
          username: 'alice',
          email: 'alice@example.com',
        }),
      );
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('renders GraphQL validation errors from the server', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Register />, {
      mocks: [
        {
          request: {
            query: REGISTER_USER,
            variables: {
              registerInput: {
                username: 'alice',
                email: 'alice@example.com',
                password: 'Password1!',
                confirmPassword: 'Password1!',
                profilePicture: 'ade',
              },
            },
          },
          result: {
            errors: [
              new GraphQLError('Errors', {
                extensions: {
                  errors: {
                    username: 'This username is taken!',
                  },
                },
              }),
            ],
          },
        },
      ],
    });

    await user.type(screen.getByPlaceholderText('Username'), 'alice');
    await user.type(screen.getByPlaceholderText('E-mail'), 'alice@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Password1!');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'Password1!');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(await screen.findByText('This username is taken!')).toBeTruthy();
  });
});
